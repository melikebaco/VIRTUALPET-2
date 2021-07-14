var  dog, happyDog, database, foodS, foodStock;
var dogImage,dogImage1,foodObj;
var fedTime,lastFed;

function preload()
{
	dogImage1 = loadImage("images/dogImg1.png")
  dogImage = loadImage("images/dogImg.png")
}

function setup() {
	createCanvas(800, 700);
  database = firebase.database();
  dog = createSprite(250,350,150,150);
  dog.addImage(dogImage); 
  dog.scale = 0.15
  
  foodObj = new Food();
  
  foodStock = database.ref("Food");
  foodStock.on("value",readStock);

  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feeddog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}


function draw() {  
  
  background(46, 139, 87);
  foodObj.display();
  
  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
      lastFed = data.val();
  });
  
  if(keyWentDown(UP_ARROW)){
    writeStock(foodS);
    dog.addImage(dogImage1);
  }

 
  //add styles here
  fill(255,255,254);
  stroke("black");

 /*  text("Food remaining : "+foodS,170,200);
  textSize(13);
  text("Note: Press UP_ARROW Key To Feed Drago Milk!",130,10,300,20); */

  textSize(15);
  if(lastFed>12){
    text("last Feed : "+lastFed% 12 + " PM",350,30);
  }else if (lastFed ===0){
    text("last Feed : 12 AM",350,30);
  }else{
    text("last Feed : "+ lastFed + "AM",350,30);
  }
  
  
  drawSprites();
}

function readStock(data){

  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){

  if(x<0){
    x=0;
  }else{
    x=x-1;  
  
  }
  database.ref('/').update({
  Food:x
  })
}
 

function feeddog(){
  dog.addImage(dogImage1);

  if(foodObj.getFoodStock()<= 0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }

  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()

  })
}


function addFoods(){
  foodS++;
  database.ref('/').update({
  Food:foodS
  })
}

