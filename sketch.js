var x1=new Array(16);
var y1=new Array(16);
var x2=new Array(16);
var y2=new Array(16);
var x3=new Array(16);
var y3=new Array(16);

var mic;
var fft;
var backcolor=0;
var button;
var backcolorR;
var backcolorG;
var backcolorB;
var name;
//var myRec;

var volhistory = [];
var lowhistory = [];
var midhistory = [];
var highistory = [];
var cenhistory = []; 
 

function setup(){
  createCanvas(1300, 800);
  smooth();
  background(0);
  mic = new p5.AudioIn();
  fft = new p5.FFT(0, 256);
  //myRec = new p5.SpeechRec();
  fft.setInput(mic);



  //myRec.onResult = showResult;
  //myRec.start();
  mic.start();

  //name=createInput('');
  //blendMode(SCREEN); 
  //frameRate(20);
}

function draw(){
    
    fill(0);
    backcolor=color(backcolorR,0,backcolorB);
    
    blendMode(NORMAL);
    background(backcolor);

    
    translate(width/2,height/2);

    push();

    //声音预处理
    var vol = mic.getLevel();

    volhistory.push(vol);
    
    if (volhistory.length > width) {
        volhistory.splice(0, 1);
    }


    var scale=500*vol;

    var spectrum = fft.analyze();

    var low = fft.getEnergy(40,120);
    var mid = fft.getEnergy(120,400);
    var high = fft.getEnergy(400,2600);

    var low_w= map(low, 0, 255, 0, 1);

    lowhistory.push(low_w);

    if (lowhistory.length > width) {
        lowhistory.splice(0, 1);
    }

    var mid_w= map(mid, 0, 255, 0, 1);

    midhistory.push(mid_w);

    if (midhistory.length > width) {
        midhistory.splice(0, 1);
    }

    var high_w= map(high, 0, 255, 0, 1);

    highistory.push(high_w);

    if (highistory.length > width) {
        highistory.splice(0, 1);
    }


    var spectralCentroid = fft.getCentroid();
	cenhistory.push(spectralCentroid);

    if (cenhistory.length > width) {
        cenhistory.splice(0, 1);
    }
	
    var nyquist = 22050;
    var meanfreq = spectralCentroid/(nyquist/spectrum.length);
    //console.log(meanfreq); 
    var meanfreq_w=map(meanfreq,0,100,1,0);
    var color1=meanfreq_w




    //音频线条
    colorMode(RGB);
    stroke(color1*80,135,229);
    strokeWeight(3);
    if (backcolorR>150) {
        stroke(140+color1*100,225,255);
    };
    push(); //保证音频线不旋转
    for (var i = 0; i < spectrum.length; i++) {
      var amp = spectrum[i];
      var l = map(amp, 0, 256, 0, 320);
      var theta=2*Math.PI/spectrum.length
      line(0,0,l*cos(i*theta),l*sin(i*theta));
    }
    pop();

  

    //黑色遮挡
    blendMode(NORMAL);
    fill(backcolor);
    noStroke();
    shapex(x2, y2);

    //圆圈
    var basic_r=60;
    blendMode(SCREEN); 

     if (backcolorB>100 || backcolorR>100) {
        blendMode(NORMAL);
    };


    //频率高的震动大，频率低的震动小
    var low_variate_map=map(low_w, 0, 1, 0, 0.25);
    var mid_variate_map=map(mid_w, 0, 1, 0, 0.25);
    var high_variate_map=map(high_w, 0, 1, 0, 0.25);

    //定义三个圆圈的坐标
    for (var i=0; i<16; i++){
      x1[i]=(basic_r+200*low_w*random(1-low_variate_map,1+low_variate_map))*sin(i*PI/8);
      y1[i]=(basic_r+200*low_w*random(1-low_variate_map,1+low_variate_map))*cos(i*PI/8);
      x2[i]=(basic_r+200*mid_w*random(1-mid_variate_map,1+mid_variate_map))*sin(i*PI/8);
      y2[i]=(basic_r+200*mid_w*random(1-mid_variate_map,1+mid_variate_map))*cos(i*PI/8);
      x3[i]=(basic_r+200*high_w*random(1-high_variate_map,1+high_variate_map))*sin(i*PI/8);
      y3[i]=(basic_r+200*high_w*random(1-high_variate_map,1+high_variate_map))*cos(i*PI/8);
    }

    //绘制低频圆圈
    colorMode(HSB);
    fill('rgba(95,223,225,0.05)');
    strokeWeight(16-12*low_w);
    stroke(270+76*low_w,75,100); //红紫渐变
    if (backcolorR>120) {
        stroke(30+60*low_w,100,100) //橙黄渐变
    };
    shapex(x1, y1);

    //绘制中频圆圈
    colorMode(RGB);
    fill('rgba(0,170,226,0.05)');
    strokeWeight(16-12*mid_w);
    stroke(130,240*mid_w,255); //天蓝紫渐变
    if (backcolorR>120) {
        stroke(255-20*mid_w,179+75*mid_w,142+113*mid_w);
    };
    shapex(x2, y2);

    //绘制高频圆圈
    noFill();
    strokeWeight(16-8*high_w);
    stroke(50-50*high_w,214+41*high_w,255-47*high_w); //天蓝色
    shapex(x3, y3);

    //绘制中间变化的圆形
    colorMode(HSB);
    fill(233+meanfreq_w*90,85-15*meanfreq_w,100,0.1+meanfreq_w*0.14);
    if (backcolorR>120) {
        fill(233,0,100,0.1+meanfreq_w*0.14);;
    };
    noStroke();
    ellipse(0,0,8*scale,8*scale);
    ellipse(0,0,4*scale,4*scale);
    ellipse(0,0,3*scale,3*scale);

    //底部旋转的花
    stroke('rgba(124,213,255,0.2)');
    if (backcolorR>180 || backcolorB>180) {
        stroke('rgba(168,144,205,0.7)');
    }; 
    noFill(); 
    strokeWeight(5-10*vol);
    shapecircle(low_w,mid_w, high_w);
    
    pop();

    //添加文字“Listening”
    fill('rgba(255,255,255,0.2)');
    noStroke();
    textSize(24);
    textAlign(CENTER);
    textFont('Georgia');
    text('Listening..', 0, -300);


  //  if (keyIsPressed === true){
  //      var img = createImage(1000, 800)

   //     saveCanvas('myCanvas', 'png');
  //  }

    //录音
    noStroke();
    colorMode(HSB);
    blendMode(SCREEN);

    push();
    for (var i = 0; i < volhistory.length; i++) {


        /*var meanfreq_h = cenhistory[i]/86;
        var meanfreq_whis=map(meanfreq_h, 0,100,0,1);
        fill(280-80*meanfreq_whis, 100, 100, 0.1);*/
        fill(310-130*((highistory[i]+midhistory[i]+lowhistory[i])/3), 100, 100, 0.1);
        var y = map(volhistory[i], 0, 1, 0,(height)/4);
        ellipse(i-width/2,height/3,y+2,y+2);
    }
    pop();

    };




//creat the shape
function shapex(x, y){
    beginShape();
    curveVertex(x[0],y[0]);
    curveVertex(x[1],y[1]);
    curveVertex(x[2],y[2]);
    curveVertex(x[3],y[3]);
    curveVertex(x[4],y[4]);
    curveVertex(x[5],y[5]);
    curveVertex(x[6],y[6]);
    curveVertex(x[7],y[7]);
    curveVertex(x[8],y[8]);
    curveVertex(x[9],y[9]);
    curveVertex(x[10],y[10]);
    curveVertex(x[11],y[11]);
    curveVertex(x[12],y[12]);
    curveVertex(x[13],y[13]);
    curveVertex(x[14],y[14]);
    curveVertex(x[15],y[15]);
    curveVertex(x[0],y[0]);
    curveVertex(x[1],y[1]);
    curveVertex(x[2],y[2]);
    endShape();
}


function shapecircle(x,y,z){
    for (var i = 10; i >0; i--) {
        var rotate_degree=map(z, 0, 1, 1, PI);
        
        rotate(PI / rotate_degree);
        ellipse(0,0,900*x*x-i*i*x,900*y*y-i*i*y);
        
    };
}


function mousePressed(){
 //var history = new Array();
 if (mouseY>600) {
 createCanvas(1500, 800);
        fill(0);
    backcolor=color(backcolorR,0,backcolorB);
    
    blendMode(NORMAL);
    background(backcolor); 
    translate(width/2,height/2);
     var history = [ volhistory[mouseX], lowhistory[mouseX], midhistory[mouseX], highistory[mouseX],cenhistory[mouseX]] ;
    var meanfreq = history[4]/(22050/256);
    //console.log(meanfreq); 
    var meanfreq_w=map(meanfreq,0,100,1,0);
    var color1=meanfreq_w;
    var img = createImage(466, 466);
    static(history[1],history[2],history[3],color1,meanfreq_w,500*history[0],history[0]); //!!!!!!!!!!!!!!!!!
 //saveCanvas('myCanvas', 'png');
 //exit();
    print(history);
   //  if (keyIsPressed === true){
     //   var img = createImage(1000, 800)

    saveCanvas(img,'myCanvas', 'png');
  //  }
  };

}

function touchMoved() {

    backcolorR=map(mouseX, 0, width, 0, 255);
    backcolorB=map(mouseY, 0, height, 0, 255);
  // prevent default
  return false;
};



function static(low_w,mid_w,high_w,color1,meanfreq_w,scale,vol){ //所有的都搞成for循环
   //translate(width/2,height/2);
   for(var k = 0; k < 2; k++)
       
    { 
        
    colorMode(RGB);
    stroke(color1*80,135,229);
    strokeWeight(3);
    if (backcolorR>150) {
        stroke(140+color1*100,225,255);
    };
   /* push(); 
    for (var i = 0; i < spectrum.length; i++) {
      var amp = spectrum[i];
      var l = map(amp, 0, 256, 0, 320);
      var theta=2*Math.PI/spectrum.length
      line(0,0,l*cos(i*theta),l*sin(i*theta));
    }
    pop();
*/
    
  push();
    //黑色遮挡
    blendMode(NORMAL);
    fill(backcolor);
    noStroke();
    shapex(x2, y2);

    //圆圈
    var basic_r=60;
    blendMode(SCREEN); 

     if (backcolorB>100 || backcolorR>100) {
        blendMode(NORMAL);
    };

    
    //频率高的震动大，频率低的震动小
    var low_variate_map=map(low_w, 0, 1, 0, 0.25);
    var mid_variate_map=map(mid_w, 0, 1, 0, 0.25);
    var high_variate_map=map(high_w, 0, 1, 0, 0.25);

    //定义三个圆圈的坐标
    for (var i=0; i<16; i++){
      x1[i]=(basic_r+200*low_w*random(1-low_variate_map,1+low_variate_map))*sin(i*PI/8);
      y1[i]=(basic_r+200*low_w*random(1-low_variate_map,1+low_variate_map))*cos(i*PI/8);
      x2[i]=(basic_r+200*mid_w*random(1-mid_variate_map,1+mid_variate_map))*sin(i*PI/8);
      y2[i]=(basic_r+200*mid_w*random(1-mid_variate_map,1+mid_variate_map))*cos(i*PI/8);
      x3[i]=(basic_r+200*high_w*random(1-high_variate_map,1+high_variate_map))*sin(i*PI/8);
      y3[i]=(basic_r+200*high_w*random(1-high_variate_map,1+high_variate_map))*cos(i*PI/8);
    }

    //绘制低频圆圈
    colorMode(HSB);
    fill('rgba(95,223,225,0.05)');
    strokeWeight(16-14*low_w);
    stroke(270+76*low_w,75,100); //红紫渐变
    if (backcolorR>120) {
        stroke(30+60*low_w,100,100)

    };
    shapex(x1, y1);

    //绘制中频圆圈
    colorMode(RGB);
    fill('rgba(0,170,226,0.05)');
    strokeWeight(16-14*mid_w);
    stroke(130,255*mid_w,255); //天蓝紫渐变
    if (backcolorR>120) {
        stroke(0,230,140+80*mid_w);
    };
    shapex(x2, y2);

    //绘制高频圆圈
    noFill();
    strokeWeight(16-10*high_w);
    stroke(50,214,255); //天蓝色
    shapex(x3, y3);

    //绘制中间变化的圆形
    colorMode(HSB);
    fill(200+meanfreq_w*30,100,100,0.1);
    noStroke();
    ellipse(0,0,3*scale,3*scale);
    fill(200+meanfreq_w*100,100,100,0.1);
    ellipse(0,0,1.5*scale,1.5*scale);

    //rotate circle
    //colorMode(RGB);
    stroke('rgba(124,213,255,0.2)');
    if (backcolorR>180 || backcolorB>180) {
        stroke('rgba(168,144,205,0.7)');
    }; 
    noFill(); 
    //noStroke();
    //fill('rgba(124,213,255,0.1)');
    strokeWeight(5-10*vol);
    shapecircle(low_w,mid_w, high_w);
    
    pop();

    fill('rgba(255,255,255,0.2)');
    /*
    if (vol>0.1) {
        fill('rgba(255,255,255,0.1)');
    } ;*/
    textSize(24);
    textAlign(CENTER);
    textFont('Georgia');
    text('recording..', 0, 300);
    //console.log(myRec.resultString);
    }
 
//写在keypressed文件里
    }
/*function touchStarted() {
    saveCanvas('myCanvas', 'png');
}*/

   /* function showResult()
    {
        if(myRec.resultValue==true) {
            background(192, 255, 192);
            text(myRec.resultString, width/2, height/2);
            console.log(myRec.resultString);
        }
    }*/
