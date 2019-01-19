



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
  let priceSubHead = `<h4 class="prices sub-head">Item Pricing</h4>`
  let d = dietArray;
  let prices = `
      
      <div class="ui section divider fade-in"></div>
           ${priceSubHead}
            <div class="field fade-in">
              <label class="fade-in">regular price</label>
              <input class="fade-in" type="text" name="price" data-text="regular" data-type="reg" placeholder="regular price">
            </div>
            <div class="field fade-in">
              <label class="fade-in">large-party price</label>
              <input class="fade-in" type="text" name="price" data-type="party" data-text="party-size" placeholder="party-sized price">
            </div>
        
  `;
  for (let i = 0; i < d.length; i++){
    if (d[i] === 'vr'){
      prices +=
        `
            <div class="field fade-in">
              <label class="fade-in">${d[i]} price</label>
              <input class="fade-in" type="text" name="price" placeholder="${d[i]} price" data-type="${d[i]}" data-text="vegan">
            </div>
            <div class="field fade-in">
              <label class="fade-in">vegan party-size price</label>
              <input class="fade-in" type="text" name="price" placeholder="vegan party-sized price" data-type="vegan_party" data-text="vegan-party-size">
            </div>
        `
    } else if (d[i] === 'gfr'){
      prices +=
        `
            <div class="field fade-in">
              <label class="fade-in">${d[i]} price</label>
              <input class="fade-in" type="text" name="price" placeholder="${d[i]} price" data-type="${d[i]}" data-text="gluten-free">
            </div>
            <div class="field fade-in">
              <label class="fade-in">${d[i]} party-size price</label>
              <input class="fade-in" type="text" name="price" placeholder="${d[i]}-party-sized price" data-type="gf_party" data-text="gf-party-size">
            </div>
        `
    }
  }
  prices += `<div class="ui section divider fade-in"></div>`;
  return prices;
}

const getSaladPrices = (dietArray) => {
  let d = dietArray;
  let prices = `
      <div class="ui section divider fade-in"></div>
            <div class="field fade-in">
              <label class="fade-in">sm salad price</label>
              <input class="fade-in" type="text" name="price" placeholder="small salad price" data-type="sm" data-text="small">
            </div>
            <div class="field fade-in">
              <label class="fade-in">lg salad price</label>
              <input class="fade-in" type="text" name="price" placeholder="large salad price" data-type="lg" data-text="large">
            </div>
            <div class="field fade-in">
              <label class="fade-in">large-party salad price</label>
              <input class="fade-in" type="text" name="price" placeholder="party-sized price" data-type="party" data-text="party-size">
            </div>
  `;
  prices += `<div class="ui section divider fade-in"></div>`;
  return prices;
}

const getPastaPrices = (dietArray) => {
  let d = dietArray;
  let prices = `
      <div class="ui section divider fade-in"></div>
            <div class="field fade-in">
              <label class="fade-in">regular price</label>
              <input class="fade-in" type="text" name="price" placeholder="regular pasta price" data-type="reg" data-text="regular">
            </div>
            <div class="field fade-in">
              <label class="fade-in">large party price</label>
              <input class="fade-in" type="text" name="price" placeholder="large party price" data-type="party" data-text="party-size">
            </div>
  `;
  prices += `<div class="ui section divider fade-in"></div>`;
  return prices;
}

const getHoagiePrices = (dietArray) => {
  
  let d = dietArray;
  let prices = `
      <div class="ui section divider fade-in"></div>
            <div class="field fade-in">
              <label class="fade-in">regular price</label>
              <input class="fade-in" type="text" name="price" placeholder="regular hoagie price" data-type="reg" data-text="regular">
            </div>
  `;
  for (let i = 0; i < d.length; i++){
    if (d[i] === 'vr'){
      prices += `
      <div class="field fade-in">
              <label class="fade-in">${d[i]} price</label>
              <input class="fade-in" type="text" name="price" placeholder="vegan hoagie price" data-type="vr" data-text="vegan">
            </div>
      `;
    }
  }
  prices += `<div class="ui section divider fade-in"></div>`;
  return prices;
}

const getPizzaPrices = (dietArray) => {
  let d = dietArray;
  let prices = `
      <div class="ui section divider fade-in"></div>
            <div class="field fade-in">
              <label class="fade-in">sm 10" pizza price</label>
              <input class="fade-in" type="text" name="price" placeholder='10"pizza price' data-type="sm" data-text="s">
            </div>
            <div class="field fade-in">
              <label class="fade-in">med 12" pizza price</label>
              <input class="fade-in" type="text" name="price" placeholder='12"pizza price' data-type="med" data-text="m">
            </div>
            <div class="field fade-in">
              <label class="fade-in">lg 16" pizza price</label>
              <input class="fade-in" type="text" name="price" placeholder='16"pizza price' data-type="lg" data-text="l">
            </div>
            `
  if (dietArray.includes('gfr')){
      prices += `<div class="field fade-in">
                    <label class="fade-in">gluten-free 10" pizza price</label>
                    <input class="fade-in" type="text" name="price" placeholder='10"gluten free price' data-type="gf" data-text="gfr">
                </div>`
  }
  
  prices += `<div class="ui section divider fade-in"></div>
            `;
  return prices;
}

const getDessertPrices = (dietArray, name) => {
  let nameArray = name.split(' ');
  let d = dietArray;
  let prices = `
    <div class="ui section divider fade-in"></div>
        <div class="field fade-in">
            <label class="fade-in">regular price</label>
            <input class="fade-in" type="text" name="price" placeholder="regular price" data-type="reg" data-text="regular">
        </div>
  `;
  if (nameArray.includes('bar') || nameArray.includes('brownie')){
    prices += `
        <div class="field fade-in">
            <label class="fade-in">small platter price</label>
            <input class="fade-in" type="text" name="price" placeholder="sm platter price" data-type="sm-platter" data-text="Sm Platter">
        </div>
        <div class="field fade-in">
            <label class="fade-in">large platter price</label>
            <input class="fade-in" type="text" name="price" placeholder="lg platter price" data-type="lg-platter" data-text="Lg Platter">
        </div>
    `;
  } else if (nameArray.includes('platter')){
    prices = `
     <div class="ui section divider fade-in"></div>
    <div class="field fade-in">
          <label class="fade-in">small platter price</label>
          <input class="fade-in" type="text" name="price" placeholder="sm platter price" data-type="sm-platter" data-text="Platter of 20 bites">
      </div>
      <div class="field fade-in">
          <label class="fade-in">large platter price</label>
          <input class="fade-in" type="text" name="price" placeholder="lg platter price" data-type="lg-platter" data-text="Platter of 40 bites">
      </div>
    `

  }
  return prices;
}

//Build Descriptions
const getDescriptions = (orderTypes) => {
  let o = orderTypes;
  let descriptions = '';
  for (let i = 0; i < o.length; i++){
    descriptions += `
        <div class="field">
            <label>${o[i]} description</label>
            <textarea name="desc" type="text" rows="3" data-type="${o[i]}"></textarea>
        </div>
  `;
  }
  return descriptions;
}


//Get Order Types
const getOrderTypes = () => {
  let orderTypes = document.getElementById('order-type')
      .querySelectorAll('a');
      orderTypes = Array.from(orderTypes);
  let types = orderTypes.map(type => {
      return type.dataset.value;
  });
  return types;
}

//Get Categories
const getCategory = () => {
  let category = document.getElementById('select-category');
      category = category.querySelector('.text').innerText;
      return category;
}

//Get Ingredients
const getIngredients = () => {
  let ingredients = document.getElementById('ingredients_dropdown').parentElement;
      ingredients = ingredients.querySelectorAll('a');
      ingredients = Array.from(ingredients);
      ingredients = ingredients.map(item => {
        let ingredient = {
          name: item.innerText,
          id: item.getAttribute('data-value')
        }
        return ingredient;
      })
      return ingredients;
}

//add, remove Tags
const getTags = (el) => {
  let tags = document.getElementById(el).parentElement;
      tags = tags.querySelectorAll('a');
      tags = Array.from(tags);
      tags = tags.map(tag => {
        return tag.getAttribute('data-value');
      })
    return tags;
}

//category switcher
const switchCategories = (category, tags, name) => {
  if(category === 'appetizers'){
        return getAppetizerPrices(tags);
    } else if(category === 'salads'){
        return getSaladPrices(tags);
    } else if (category === 'hoagies'){
        return getHoagiePrices(tags);
    } else if (category === 'pizza'){
        return getPizzaPrices(tags);
    } else if (category === 'pasta'){
        return  getPastaPrices(tags);
    } else if (category === 'desserts'){
        return getDessertPrices(tags, name);
    }
}

//Get pricing from form
const getPricing = (form, input) => {
  let prices = form.querySelectorAll(input);
      prices = Array.from(prices);
      prices = prices.map(price => {
        let item = {
          type: price.getAttribute('data-type'),
          text: price.getAttribute('data-text'),
          amount: price.value
        }
        return item;
      })
      return prices;
}

