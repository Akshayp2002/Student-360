// comment box script 

$(document).ready(function(){ 
  
    $(".primaryContained").on('click', function(){
    $(".comment").addClass("commentClicked");
  });//end click
  $("textarea").on('keyup.enter', function(){
    $(".comment").addClass("commentClicked");
  });//end keyup
  });//End Function

new Vue({
    el: "#app",
    data:{
       title: 'Add a comment',
      newItem: '',
      item: [],
    },
    methods:{
      addItem  (){
      this.item.push(this.newItem);
        this.newItem = "";
      }
  }

  });




  function dateOnly(date){

    var day=date.getDate()   
    var month=date.getMonth()+1 
    var year=date.getFullYear()
  
    return day+'/'+month+'/'+year
  }


  function enableSubmitButton() {
    document.getElementById('submitButton').disabled = false;
    document.getElementById('loader').style.display = 'none';
  }
  function disableSubmitButton() {
    document.getElementById('submitButton').disabled = true;
    document.getElementById('loader').style.display = 'unset';
  }
  