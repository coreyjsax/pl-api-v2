



function openNav(target) {
  target.querySelector('.sidenav').style.width = "150px";
  target.querySelector('.main').style.marginLeft = "150px"
  target.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function closeNav(gallery) {
  gallery.querySelector('.sidenav').style.width = '0'; 
  gallery.querySelector('.main').style.marginLeft = '0';
  gallery.style.backgroundColor = 'white';
}

function getModal(params){
  let modal = document.getElementById(params.modal);
  let headerDest = modal.querySelector('.header');
  let contentDest = modal.querySelector('.content');
}


    
