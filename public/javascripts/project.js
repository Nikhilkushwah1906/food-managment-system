$(document).ready(function(){
    $.getJSON("/food/fetch_foodcategory",function (foodcategory_data) {
            foodcategory_data.data.map( (item) => {
                $('#foodcategory').append($('<option>').text(item.foodcategory_name).val(item.foodcategory_id));
            })
        }
    );

    $('#foodcategory').change(function () {
        $('#foodsubcategory').empty();
        $('#foodsubcategory').append($('<option>').text('Food Sub Category'));
        $.getJSON('/food/fetch_subfoodcategory',{foodcategoryid : $('#foodcategory').val()},function(foodsubcategory_data){
            foodsubcategory_data.data.map((item) => {
                $('#foodsubcategory').append($('<option>').text(item.foodsubcategory_name).val(item.foodsubcategory_id));
            })
        })
    })

})

function showPicture() {
    const selecetfile = foodlogo.files[0]
    foodpic.src= URL.createObjectURL(selecetfile)
}