//Clock
const Clocktime = () => {
    const noon = 12;
    const currentTime = new Date();
    let hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();
    let seconds = currentTime.getSeconds();
    let meridian = `AM`;
  
    //Change AM to PM or vice-versa
    if (hours >= noon) {
        meridian = `PM`;
    }
    //Use a non 24 hours style
    if (hours > noon) {
        hours -= 12;
    }
    //Setting minutes
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    //Setting seconds
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    // Display the time
    const CTime = hours + ":" + minutes + ":" + seconds + " " + meridian;
    document.getElementById("clock_paragraph").innerText = CTime;
  }
  
  window.onload = () => {
    Clocktime();
    // Getting the clock to increment once a second
    const oneSecond = 1000;
    setInterval( Clocktime, oneSecond);
  }
  
  //Responsiveness of the nav bar
  function myFunction(){
      const res = document.getElementById("myTopnav");
      if (res.className === "topnav") {
        res.className += " responsive";
      } else {
        res.className = "topnav";
      }
    }
  
    //Show and hide search div
    function ShowSearchDiv(){
      document.getElementById("search").style.display="block";
    
    }
  
    //Scroll back to top
    function topFunction(){
      document.body.scrollTop=0;
      document.documentElement.scrollTop=0;
    }
    //Show review div
    function showReviewDiv(){
        document.getElementById("mentor_review_div").style.display= "block";
        document.getElementById("single_session_div1").style.display="none";
        document.getElementById("single_session_div2").style.display="none";
        document.getElementById("single_session_div3").style.display="none";
        document.getElementById("single_session_div4").style.display="none";
    }
  //Update the review once the Submit review button is clicked
  function updateReview(){
      let review_value= document.getElementById("review_input").value;
      let review_comment_value= document.getElementById("review_comment_input").value;
      let comment_length= review_comment_value.length;
      if(review_value>5 || review_value<1){
          document.getElementById("review_input").style.borderColor="red";
      }else{
        if(comment_length>24){
          document.getElementById("review_comment_input").style.borderColor="red";
        }else{
          document.getElementById("mentor_review_div").style.display= "none";
          document.getElementById("single_session_div1").style.display="block";
          document.getElementById("single_session_div2").style.display="block";
          document.getElementById("single_session_div3").style.display="block";
          document.getElementById("single_session_div4").style.display="block";
          document.getElementById("review_comments_gst").innerHTML=review_comment_value;

          document.getElementById("not_reviewed").style.display="none";
          document.getElementById("review_stars_gustave").style.display="inline-block";
          var all_stars = document.getElementById("review_stars_gustave").querySelectorAll(".fa-star");
          if(review_value==1){
            all_stars[0].style.color = "orange";
            all_stars[1].style.display = "none";
            all_stars[2].style.display = "none";
            all_stars[3].style.display = "none";
            all_stars[4].style.display = "none";
            document.getElementById("mentor_review_div").style.display="none";
            document.getElementById("review_session_btn").disabled= "true";
          }
          if(review_value==2){
            for(let i=0; i<=1; i++){
              all_stars[i].style.color="orange";
            }
            all_stars[2].style.display = "none";
            all_stars[3].style.display = "none";
            all_stars[4].style.display = "none";
            document.getElementById("mentor_review_div").style.display="none";
            document.getElementById("review_session_btn").disabled= "true";
          }
          if(review_value==3){
            for(let i=0; i<=3; i++){
              all_stars[i].style.color="orange";
            }
            all_stars[3].style.display = "none";
            all_stars[4].style.display = "none";
            document.getElementById("mentor_review_div").style.display="none";
           document.getElementById("review_session_btn").disabled= "true";
          }
          if(review_value==4){
            for(let i=0; i<=4; i++){
              all_stars[i].style.color="orange";
            }
            all_stars[4].style.display = "none";
            document.getElementById("mentor_review_div").style.display="none";
            document.getElementById("review_session_btn").disabled= "true";
          }
          if(review_value==5){
            for(let i of all_stars){
              i.style.color="orange";
            }
            
            document.getElementById("mentor_review_div").style.display="none";
            document.getElementById("review_session_btn").disabled= "true";
          }
        }
      }
  }