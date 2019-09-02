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
    }
  //Accept mentorship session request
  function AcceptReq(){
      document.getElementById("req_status_paragraph").innerText="Accepted";
      document.getElementById("pending_accept_btn").disabled= "true";
      document.getElementById("pending_reject_btn").disabled= "true";
  }
  //Reject mentorship session request
  function RejectReq(){
    document.getElementById("req_status_paragraph").innerText="Rejected";
    document.getElementById("pending_accept_btn").disabled= "true";
    document.getElementById("pending_reject_btn").disabled= "true";
}
