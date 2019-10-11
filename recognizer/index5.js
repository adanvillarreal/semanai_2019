//Realizado el 5/31/2019
let net;
const webcamElement = document.getElementById('webcam');
const classifier = knnClassifier.create();
let total = 0.0;
let flag = true;
var wait = ms => new Promise((r, j)=>setTimeout(r, ms))

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

function knnLoad(){
  //can be change to other source
  let tensorObj = JSON.parse(data);
  //covert back to tensor
  Object.keys(tensorObj).forEach((key) => {
    tensorObj[key] = tf.tensor(tensorObj[key], [Math.floor(tensorObj[key].length / 1000), 1024]);
    console.log(Math.floor(tensorObj[key].length));
  });
  classifier.setClassifierDataset(tensorObj);
}

async function app() {
  console.log('Loading mobilenet..');

  // Load the model.
  net = await mobilenet.load();
  console.log('Sucessfully loaded model');

  // Make a prediction through the model on our image.
  //const imgEl = document.getElementById('img');
  //const result = await net.classify(imgEl);
  console.log('Loading Knn-classifier');
  knnLoad();
  console.log('Knn loaded');
  await setupWebcam();

  //Esto se agrego para predecir en cada frame
  while (true) {
    if (classifier.getNumClasses() > 0) {
      // Get the activation from mobilenet from the webcam.
      const activation = net.infer(webcamElement, 'conv_preds');
      // Get the most likely class and confidences from the classifier module.
      let k = 10;
      const result = await classifier.predictClass(activation,k);

      const classes = ['Heineken', 'Heineken-Light', 'Heineken can','Adidas thermos flask','Coca-cola','Cafe Andatti','Background'];
      let precio = 0.0;
      if(result.label=="0"){
        precio=1.55;
      }else if (result.label=="1"){
        precio=1.68;
      }else if (result.label=="2"){
        precio=2.83;
      }else if (result.label=="3"){
          precio=19.20;
      }else if (result.label=="4"){
          precio=1.8;
      }else if (result.label=="5"){
          precio=17.50;
      } else{
        //console.log('Nada');
      }

      /* Comentado para pasarlo abajo
      document.getElementById('console').innerText = `
        prediction: ${classes[result.label]}\n
        probability: ${Math.floor(result.confidences[result.label]*100)}\n
        PRECIO:     ${precio}`;
        */
      /*
      document.getElementById('console').innerText = `
        prediction: ${classes[result.label]}\n
        probability: ${result.confidences[result.label]}
      `;*/
      if((result.label=="0")&&(result.confidences[result.label]>=0.7)){
        document.getElementById('console').innerText = `
          prediction: ${classes[result.label]}\n
          probability: ${Math.floor(result.confidences[result.label]*100)}\n
          price:$     ${precio}`;
        document.getElementById("fotos").innerHTML="<img id=\"image1\" src=\"img/heineken.jpg\" />";
        //alert('Producto detectado');
        let producto = 'img/heineken.jpg';
        oferta('Heineken');
        await wait(3000);
        alerta('Heineken',producto,precio);
        await wait(2000);
      }else if ((result.label=="1")&&(result.confidences[result.label]>=0.7)){
        document.getElementById('console').innerText = `
          prediction: ${classes[result.label]}\n
          probability: ${Math.floor(result.confidences[result.label]*100)}\n
          price:$     ${precio}`;
        document.getElementById("fotos").innerHTML="<img id=\"image2\" src=\"img/light.jpg\" />";
        //alert('Producto detectado');
        let producto = 'img/light.jpg';
        alerta('Heineken Light',producto,precio);
        await wait(2000);
      }else if ((result.label=="2")&&(result.confidences[result.label]>=0.7)){
          document.getElementById('console').innerText = `
          prediction: ${classes[result.label]}\n
          probability: ${Math.floor(result.confidences[result.label]*100)}\n
          price:$     ${precio}`;
          document.getElementById("fotos").innerHTML="<img id=\"image3\" src=\"img/lata.jpg\" />";
          //alert('Producto detectado');
          let producto = 'img/lata.jpg';
          alerta('Heineken can',producto,precio);
          await wait(2000);
      }else if ((result.label=="3")&&(result.confidences[result.label]>=0.9)){
          document.getElementById('console').innerText = `
          prediction: ${classes[result.label]}\n
          probability: ${Math.floor(result.confidences[result.label]*100)}\n
          price:$     ${precio}`;
          document.getElementById("fotos").innerHTML="<img id=\"image4\" src=\"img/adidas.jpg\" />";
          //alert('Producto detectado');
          let producto = 'img/adidas.jpg';
          alerta('Adidas thermos flask',producto,precio);
          await wait(2000);
      }else if ((result.label=="4")&&(result.confidences[result.label]>=0.7)){
          document.getElementById('console').innerText = `
          prediction: ${classes[result.label]}\n
          probability: ${Math.floor(result.confidences[result.label]*100)}\n
          price:$     ${precio}`;
          document.getElementById("fotos").innerHTML="<img id=\"image5\" src=\"img/cocacola.jpg\" />";
          //alert('Producto detectado');
          let producto = 'img/cocacola.jpg';
          alerta('Coca-cola',producto,precio);
          await wait(2000);
      }else if ((result.label=="5")&&(result.confidences[result.label]>=0.9)){
          document.getElementById('console').innerText = `
          prediction: ${classes[result.label]}\n
          probability: ${Math.floor(result.confidences[result.label]*100)}\n
          price:$     ${precio}`;
          document.getElementById("fotos").innerHTML="<img id=\"image5\" src=\"img/andatti.jpg\" />";
          //alert('Producto detectado');
          let producto = 'img/andatti.jpg';
          alerta('Cafe Andatti',producto,precio);
          await wait(2000);
      }else if ((result.label=="6")&&(result.confidences[result.label]>=0.3)){
        document.getElementById('console').innerText = `
          prediction: ${classes[result.label]}\n
          probability: ${Math.floor(result.confidences[result.label]*100)}\n
          price:$     ${precio}`;
          document.getElementById("fotos").innerHTML="<img id=\"image5\" src=\"img/fondo.jpg\" />";
          document.getElementById('total').innerText =`
            Total: $ ${total}`;
      }
      else{
        //document.getElementById("fotos").innerHTML="<img id=\"image5\" src=\"img/fondo.jpg\" />";
        //console.log('nada');
      }
    }
    // Give some breathing room by waiting for the next animation frame to
    // fire.
    await tf.nextFrame();
  }
}

//document.getElementById('predict-classes').addEventListener('click', () => predict());

function predict(){
  console.log('Predict');
}
/* Esto es por si se quiere predecir por boton
async function predict() {
  console.log('Entro al evento del boton')
  const activation = net.infer(webcamElement, 'conv_preds');
  console.log('despues de activación');
  const result = await classifier.predictClass(activation);
  const classes = ['HEINEKEN', 'HEINEKEN LIGHT','HEINEKEN LATA','TERMO ADIDAS'];
  document.getElementById('console').innerText = `
    prediction: ${classes[result.label]}\n
    probability: ${result.confidences[result.label]}
  `;
}*/
function toFixed(num, fixed) {
    fixed = fixed || 0;
    fixed = Math.pow(10, fixed);
    return Math.floor(num * fixed) / fixed;
}

function oferta(nombre){
  Swal.fire('Product ' + ' 2 for 1 sale!');
}
//función para lanzar la alerta
function alerta(nombre,producto,precio){
  //se agrego este if para agregar oferta
  Swal.fire({
      title: 'Item',
      text: "Add this item to your shopping cart?",
      imageUrl: producto,
      imageWidth:100 ,
      imageHeight: 120,
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      cancelButtonColor: '#d33'
}).then((result) => {
  if (result.value) {
    Swal.fire(
      'Ok!',
      'Your product has been added!',
      'success'
    )
    total = total + precio;
	total= toFixed(total,2);
    document.getElementById('total').innerText =`
      Total: $${total}`;
    var node = document.createElement("li");                 // Create a <li> node
    var textnode = document.createTextNode(nombre);         // Create a text node
    node.appendChild(textnode);                              // Append the text to <li>
    document.getElementById("items").appendChild(node);     // Append <li> to <ul> with id="myList"
  }
})
}

app();
