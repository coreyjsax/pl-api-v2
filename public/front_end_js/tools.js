



function openNav(target) {
  target.querySelector('.sidenav').style.width = "150px";
  target.querySelector('.main').style.marginLeft = "150px"
  target.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function closeNav(gallery) {
  gallery.querySelector('.sidenav').style.width = '0'; 
  gallery.querySelector('.main').style.marginLeft = '0';
  gallery.style.backgroundColor = '';
}

function getModal(params){
  let modal = document.getElementById(params.modal);
  let headerDest = modal.querySelector('.header');
  let contentDest = modal.querySelector('.content');
}


    
//Items Price Fields

const getAppetizerPrices = (dietArray) => {
  let d = dietArray;
  let prices = `
      <div class="ui section divider fade-in"></div>
            <div class="field fade-in">
              <label class="fade-in">regular price</label>
              <input class="fade-in" type="text" name="reg" placeholder="regular price">
            </div>
            <div class="field fade-in">
              <label class="fade-in">large-party price</label>
              <input class="fade-in" type="text" name="party" placeholder="party-sized price">
            </div>
        
  `;
  for (let i = 0; i < d.length; i++){
    if (d[i] === 'vr'){
      prices +=
        `
            <div class="field fade-in">
              <label class="fade-in">${d[i]} price</label>
              <input class="fade-in" type="text" name="${d[i]}" placeholder="${d[i]} price">
            </div>
            <div class="field fade-in">
              <label class="fade-in">${d[i]} party-size price</label>
              <input class="fade-in" type="text" name="${d[i]}-party" placeholder="${d[i]}-party-sized price">
            </div>
        `
    } else if (d[i] === 'gfr'){
      prices +=
        `
            <div class="field fade-in">
              <label class="fade-in">${d[i]} price</label>
              <input class="fade-in" type="text" name="${d[i]}" placeholder="${d[i]} price">
            </div>
            <div class="field fade-in">
              <label class="fade-in">${d[i]} party-size price</label>
              <input class="fade-in" type="text" name="${d[i]}-party" placeholder="${d[i]}-party-sized price">
            </div>
        `
    }
  }
  return prices;
}

const getSaladPrices = (dietArray) => {
  let d = dietArray;
  let prices = `
      <div class="ui section divider fade-in"></div>
            <div class="field fade-in">
              <label class="fade-in">sm salad price</label>
              <input class="fade-in" type="text" name="sm" placeholder="small salad price">
            </div>
            <div class="field fade-in">
              <label class="fade-in">lg salad price</label>
              <input class="fade-in" type="text" name="lg" placeholder="large salad price">
            </div>
            <div class="field fade-in">
              <label class="fade-in">large-party salad price</label>
              <input class="fade-in" type="text" name="party" placeholder="party-sized price">
            </div>
  `;
  return prices;
}