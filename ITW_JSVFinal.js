const api_url = "https://6245f389e3450d61b0f926c1.mockapi.io/api/v1/";
var button_id;
var $ = function (id) { return document.getElementById(id); };//function to store id from HTML

async function getApiData(url) {//function to process data from API to an Array
    try {
        let connection = await fetch(url);
        return await connection.json();
    } catch (error) {
        console.log(error);//-Debug- display error if data from API cannot be extracted
    }
}
async function getButtons() {//function shows available categories from API to show table of selected category
    var data = await getApiData(api_url + "categories");
    var html = "<span>Filter: </span>";
   

    data.forEach(item => {
        var html_segment = `<label for="${item.id}"><input type ="radio" name="option" id="${item.id}" 
                value="${item.id}" onclick="getTable(${item.id});">${item.name}</label>`;
        html += html_segment;
    });

    $("options").innerHTML = html;
}
async function getTable(button_id) {//function draws a table responding to selected category
    var item_array = (await getApiData(api_url + "categories/" + button_id + "/items")).items;
    //console.log(item_array);//-Debug-log array of items of selected category 
    var table = `<div class="row">
                    <div class="column">
                        &nbsp
                    </div>
                    <div class="column">
                        Item
                    </div>
                    <div class="column">
                        Description
                    </div>
                    <div class="column">
                        Price
                    </div>
                </div>`;

    for (var j = 0; j < item_array.length; j++) {
        
        var row = `<div class="row" onclick="itemPage(${item_array[j].categoryId},${j});">

                    <div class="column" >
                    <img id="image" src="${item_array[j].image[0]}">
                    </div>
                    <div class="column">
                    ${item_array[j].itemName}
                    </div>
                    <div class="column">
                    ${item_array[j].itemBrief}
                    </div>
                    <div class="column">
                    $${item_array[j].price}
                    </div>
                </div>`;

        //console.log(item_array[j])//-Debug-logs array of each item from API

        table += row;
    };
    $("grid_table").innerHTML = table;
}
async function itemPage(cat_id, item_num) {// function to hide nav and table and show item page
    var item_detail = (await getApiData(api_url + "categories/" + cat_id + "/items")).items[item_num];
    //console.log(item_detail);//-Debug-logs array of selected item from table

    $("wrapper").style.display = "none";
    $("item_view").style.display = "block";
    $("item_name").innerHTML = item_detail.itemName;
    $("item_price").innerHTML = "$" + item_detail.price;
    $("item_desc_full").innerHTML = item_detail.itemFull;
    
    $("main_image").innerHTML = drawMainSlide(item_detail);
    $("gallery_images").innerHTML = drawGallerySlide(item_detail);


    var size = `<label for="size">Size:</label>
                <select name ="size" id="size">
                <option selected disabled>Select a size</option>`;
    item_detail.size.forEach(item => {
        var size_option = `<option value="${item}">${item}</option>`;
        size += size_option;
    });

    var color = `<label for="color">Color:</label>
            <select name ="color" id="color">
                <option selected disabled>Select a color</option>`;
    item_detail.colors.forEach(item => {
        var color_option = `<option value="${item}">${item}</option>`;
        color += color_option;
    });

    var quant = `<label for="quant">Quantity:</label>
            <select name ="quant" id="quant">
                <option selected disabled>Select a quantity</option>`;
    for (var i = 1; i < 11; i++) {
        var quant_option = `<option value="${i}">${i}</option>`;
        quant += quant_option;
    };

    $("size_menu").innerHTML = size;
    $("color_menu").innerHTML = color;
    $("quant_menu").innerHTML = quant;


    $("exit_button").innerHTML = `<button type ="button" name="exit" 
                value="exit" onclick="hideItemPage();">x</button>`

    $("buy_button").innerHTML = `<button type ="button" name="buy"
                value="buy" onclick="">Buy Now</button>`
};

async function hideItemPage() {// function hides homepage and shows itempage
    $("wrapper").style.display = "block";// hides homepage
    $("item_view").style.display = "none";//shows itempage
};

getButtons();//call function to show category option

function drawMainSlide(item_detail) {
    html = `<img class="image_slide" id="main_image_slide" src='${item_detail.image[0]}'>`;
    return html;
};
function drawGallerySlide(item_detail) {//function to retrieve and draw images for product page
    var images = [];
    for (let i = 0; i < item_detail.image.length; i++) {
        //create list of images
        images = images.concat(`<img class="image_slide" onclick="flipImage('${item_detail.image[i]}')" src='${item_detail.image[i]}'>`);
        //console.log(images); //-Debug- checks entries into images array       
    };
    images = images.join("");
    //console.log(images); //-Debug- checks string output of completed images array
    return images;  
};
function flipImage(url) {
    //console.log(url); //-Debug-
    $("main_image_slide").src = url;
}
