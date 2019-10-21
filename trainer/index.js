//Realizado el 5/31/2019

//Variable para red
let net;

//Variable para objeto webcam
const webcamElement = document.getElementById('webcam');

//Variable contador
const contador = document.getElementById('contador');

//Variable para clasificador Knn
const classifier = knnClassifier.create();

//Función para inicializar webcam
async function setupWebcam() {
  return new Promise((resolve, reject) => {
    const navigatorAny = navigator;
    navigator.getUserMedia = navigator.getUserMedia ||
        navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
        navigatorAny.msGetUserMedia;
    if (navigator.getUserMedia) {
      navigator.getUserMedia({video: true},
        stream => {
          console.log(webcamElement)
          webcamElement.srcObject = stream;
          webcamElement.addEventListener('loadeddata',  () => resolve(), false);
        },
        error => reject());
    } else {
      reject();
    }
  });
}

async function app() {
  console.log('Loading mobilenet..');

  //Aquí se debe cargar la red mobilnet
  net = await mobilenet.load();
  console.log('Sucessfully loaded model');

  //Se llama webcam
  await setupWebcam();

  // Reads an image from the webcam and associates it with a specific class
  // index.

  const addExample = classId => {

  // TODO: En esta parte se debe agregar la logica que incremente el elemento contador  que cuente los ejemplos por producto
  document.getElementById('contador').innerHTML =
  String(document.getElementById('contador').innerHTML - "0" + 1)

	//Aqui es donde sucede el TRANSFER LEARNING:

    // Get the intermediate activation of MobileNet 'conv_preds' and pass that
    // to the KNN classifier.
    const activation = net.infer(webcamElement, 'conv_preds');

    // Pass the intermediate activation to the classifier.
    classifier.addExample(activation, classId);
 };

 // TODO: Aqui va tu codigo  hint: (ES DONDE SE DEBE AGREGAR DISTINTOS PRODUCTOS Y VINCULARLO AL HTML)
 // ejemplo: document.getElementById('class-a').addEventListener('click', () => addExample(0));
 document.getElementById('class-a').addEventListener('click', () => addExample(0));
 document.getElementById('class-b').addEventListener('click', () => addExample(1));
 document.getElementById('class-c').addEventListener('click', () => addExample(2));
 //////////////////////////

  while (true) {
    if (classifier.getNumClasses() > 0) {

      // Get the activation from mobilenet from the webcam.
      const activation = net.infer(webcamElement, 'conv_preds');

      // Get the most likely class and confidences from the classifier module.
      const result = await classifier.predictClass(activation);

  	  // TODO: Agregar el número de clases MODIFICAR SEGUN TU NUMERO DE CLASES
      const classes = ['A', 'B', 'C'];
      document.getElementById('console').innerText = `
        prediction: ${classes[result.classIndex]}\n
        probability: ${result.confidences[result.classIndex]}
      `;

      // Estaria cool que en lugar de console.log hubiera algun <p> con la clase cambiando.
      console.log(result);
    }
    //Esperamos el siguiente Frame
    await tf.nextFrame();
  }
}

function save() {
	// TODO: Declarar variable dataset la cual tendra los pesos del clasificador KNN previamente alimentado
  // Para obtener estos pesos se debe usar el metod getClassifierDataset  del objeto KNN
  dataset = classifier.getClassifierDataset()
	//
   var datasetObj = {}
   Object.keys(dataset).forEach((key) => {
     let data = dataset[key].dataSync();
     datasetObj[key] = Array.from(data);
   });
   let jsonStr = JSON.stringify(datasetObj);
   localStorage.setItem("knnClassifier", jsonStr);
   saveData(jsonStr, 'knnClassifierAndatti.json');
 }

 function saveData(jsonStr, filename) {
    // TODO: guardar/descargar un archivo con nombre filename y contenido jsonStr
    var a = document.createElement("a")
    var blob = new Blob([jsonStr], {type: "text/json;charset=utf-8"});
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
 }

app();
