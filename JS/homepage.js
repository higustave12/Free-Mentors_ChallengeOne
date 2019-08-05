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
  //Redirect to a page of mentors once the "View mentors" buttons clicked
  function Redirect_JS(){
    const url="./All_Mentors/Javascript.html";
    window.location.href= url;
  };
  function Redirect_C(){
    const url="./All_Mentors/C.html";
    window.location.href= url;
  };
  function Redirect_Cplus(){
    const url="./All_Mentors/Cplus.html";
    window.location.href= url;
  };
  function Redirect_C_sharp(){
    const url="./All_Mentors/C_sharp.html";
    window.location.href= url;
  };
  function Redirect_Android(){
    const url="./All_Mentors/Android.html";
    window.location.href= url;
  };
  function Redirect_Sql(){
    const url="./All_Mentors/Sql.html";
    window.location.href= url;
  };
  function Redirect_Ruby(){
    const url="./All_Mentors/Ruby.html";
    window.location.href= url;
  };
  function Redirect_Python(){
    const url="./All_Mentors/Python.html";
    window.location.href= url;
  };