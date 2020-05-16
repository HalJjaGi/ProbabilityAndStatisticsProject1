//konva 를 위한 변수들
var Width = 500;
var Height = 500;
var minX = -14; var maxX = 14;
var minY  = -14; var maxY  = 14;
var rangeX  = maxX - minX;
var rangeY  = maxY - minY;
var scaleX  = Width / rangeX;
var scaleY =  Height  / rangeY;


//밑의 연산을 위한 변수들
var innerCircle = 0;
var outerCircle = 0;
var trialNum = 1;
var totalInner = 0;
var totalOuter = 0;


//차트를 위한 변수
var data;
var options;
var chart;


//konva를 이용한 기본 그래프 그리기
var stage = new Konva.Stage({
container: 'container',
width: Width,
height: Height,
scaleX: scaleX,
scaleY: scaleY,
offset: {
	x: -14,
	y: -14
}			
});		

var layer = new Konva.Layer();
stage.add(layer);

var tc = new Konva.Text(
    {
    fontSize: 0.7,
    x: 0,
    y: 0,
    text: '(0 , 0)',
    fill: 'blue'
    });	
layer.add(tc);

var tx = new Konva.Text(
    {
    fontSize: 0.7,
    x: 10,
    y: 0,
    text: '(1 , 0)',
    fill: 'blue'
    });	
layer.add(tx);

var ty = new Konva.Text(
    {
    fontSize: 0.7,
    x: 0,
    y: -10,
    text: '(0 , 1)',
    fill: 'blue'
    });	
layer.add(ty);

var txy = new Konva.Text(
    {
    fontSize: 0.7,
    x: 10,
    y: -10,
    text: '(1 , 1)',
    fill: 'blue'
    });	
layer.add(txy);

 var yaxis = new Konva.Arrow({
  points: [0, 13, 0, -13],
  pointerLength: 0.3,
  pointerWidth: 0.2,
  pointerAtBeginning: true,
  fill: 'green',
  stroke: 'green',
  strokeWidth: 0.1
});
layer.add(yaxis);

var xaxis = new Konva.Arrow({
  points: [13, 0, -13, 0],
  pointerLength: 0.3,
  pointerWidth: 0.2,
  pointerAtBeginning: true,
  fill: 'green',
  stroke: 'green',
  strokeWidth: 0.1
});
layer.add(xaxis);


var rect = new Konva.Rect({
    x: 0,
    y: -10,
    width: 10,
    height: 10,		  
  
    stroke: '#00D2FF',
    strokeWidth: 0.1,
    dash: [0.5, 0.2]
  });		
  layer.add(rect);

  var dotc = new Konva.Circle({
    x: 0,
    y: 0,
    radius: 0.2,

    fill: 'blue'
  });

layer.add(dotc);


  var dotx = new Konva.Circle({
    x: 10,
    y: 0,
    radius: 0.2,

    fill: 'blue'
  });

layer.add(dotx);

var doty = new Konva.Circle({
    x: 0,
    y: -10,
    radius: 0.2,

    fill: 'blue'
  });

layer.add(doty);

var dotxy = new Konva.Circle({
    x: 10,
    y: -10,
    radius: 0.2,

    fill: 'blue'
  });

layer.add(dotxy);

var circle = new Konva.Circle({
    x: 5,
    y: -5,
    radius: 5,

    stroke: 'red',
    strokeWidth: 0.1
  });

layer.add(circle);


layer.draw();


function updateText(e) {
position.text('(' + Math.round(e.target.x()) + ', ' + Math.round(e.target.y()) + ')');
layer.batchDraw();
}

circle.on('dragmove', updateText);  








//그래프그리기 버튼 이벤트, 구글차트 이용
function drawGraph () {

  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);
  

  function drawChart() {

    var data = new google.visualization.DataTable();

    data.addColumn('number', '시행');
    data.addColumn('number', '추정값');


    data.addRows(trialNum);
  
    
    var i = 0;
    while (i<trialNum-1) {
      data.setCell(i, 0, i+1);
      data.setCell(i, 1, document.getElementsByClassName("r-"+i)[0].getAttribute("result"));
      i++;
    }

   

    var options = {
      title: '원주율 추정 결과',
      curveType: 'function',
      legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart'));

    chart.draw(data, options);
  }


  
  
  
}








//시행횟수 입력 이벤트, 실제 시행 및 원주율 추정
function trial() {

  var i = 0;

  while(i<document.getElementById("num").value) {

    var ranX = Math.random() * 10;
    var ranY = Math.random() * 10;

    if((ranX-5)*(ranX-5) + (ranY-5)*(ranY-5) > 25) {
      var dotsample1 = new Konva.Circle({
        x: ranX,
        y: -ranY,
        radius: 0.2,

        fill: '#00D2FF'
      });

      layer.add(dotsample1);
    
      outerCircle += 1;
      $(".p-2").html("원 안의 점 : " + outerCircle + "개");
    }
    else if((ranX-5)*(ranX-5) + (ranY-5)*(ranY-5) < 25){
      var dotsample2 = new Konva.Circle({
      x: ranX,
      y: -ranY,
      radius: 0.2,

      fill: 'red'
      });

  
      layer.add(dotsample2);


      innerCircle += 1;
      $(".p-1").html("원 안의 점 : " + innerCircle + "개");
    }
    else {
      continue;
    }

    i++;
  } 


  layer.draw();

  totalInner += innerCircle;
  totalOuter += outerCircle;

  var result = document.createElement("p");
  result.appendChild(document.createTextNode("총 " + trialNum + "까지의 시행을 거친 원주율의 추정값은 " + 4*totalInner/(totalInner + totalOuter) + " 입니다."));
  result.setAttribute("class", "r-" + (trialNum-1));
  result.setAttribute("result", 4*totalInner/(totalInner + totalOuter));
  $(result).appendTo(".result");

  trialNum += 1;

}
