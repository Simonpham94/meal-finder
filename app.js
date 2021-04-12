const form = document.getElementById('form');
const input = document.getElementById('input');
const search = document.getElementById('search');
const random = document.getElementById('random');
const resultHeading = document.getElementById('result-heading');
const mealsEl = document.getElementById('meals');
const singleRecipe = document.getElementById('single-recipe');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const close = document.getElementById('close');

//function search meals
function searchMeal(e) {
    e.preventDefault();

    //clear single recipe 
    singleRecipe.innerHTML = '';

    //get search term
    const term = input.value;

    //check for empty and fetch API
    if(term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                resultHeading.innerHTML = `<h2>Search results for "${term}":</h2>`;

                if(data.meals === null) {
                    resultHeading.innerHTML = `<h2>There are no search results for "${term}". Try again!</h2>`;
                } else {
                    mealsEl.innerHTML = data.meals
                        .map(meal => `
                            <div class="meal">
                                <img src='${meal.strMealThumb}' alt="${meal.strMeal}">
                                <div class="meal-info" data-mealID=${meal.idMeal}>
                                    <h2>${meal.strMeal}</h2>
                                </div>
                            </div>
                        `)
                        .join('');

                }
            })
            //clear search text
            input.value = '';     
    } else {
        alert('Please enter meal name or keywords')
    }
}

//fetch random meal from API
function getRandomMeal() {
    //clear meals and heading
    mealsEl.innerHTML = ''; 
    resultHeading.innerHTML = '';

    //fetch API 
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            const  meal = data.meals[0];
            addMealToDOM(meal);
        })
}

//get meal by id
function getMealById(mealID) {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
            .then(res => res.json())
            .then(data => {
                const  meal = data.meals[0];
                addMealToModal(meal);
            })
    }

//add meal to DOM
function addMealToDOM(meal){
    const ingredients = []; 
    for(let i = 1; i<=20; i++) {
        if(meal[`strIngredient${i}`]) {
            ingredients.push(
                `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
            )
        } else {
            break;
        }
    } 

    singleRecipe.innerHTML = `
        <div class="single-recipe">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="single-meal-info">
                ${meal.strCategory ? `<h2><strong>${meal.strCategory}</strong></h2>` : ''}
                ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
            </div>
            <div class="main">   
                <p>${meal.strInstructions}</p>
                <h2>Ingredients</h2>
                <ul>
                    ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
            </div>
        </div>

    `
}

//function add meal to Modal 


function addMealToModal(meal){
    const ingredients = []; 
    for(let i = 1; i<=20; i++) {
        if(meal[`strIngredient${i}`]) {
            ingredients.push(
                `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
            )
        } else {
            break;
        }
    } 

    modalBody.innerHTML = `
        <div class="single-recipe">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="single-meal-info">
                ${meal.strCategory ? `<h2><strong>${meal.strCategory}</strong></h2>` : ''}
                ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
            </div>
            <div class="main">   
                <p>${meal.strInstructions}</p>
                <h2>Ingredients</h2>
                <ul>
                    ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
            </div>
        </div>

    `
}


//event handlers
form.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

mealsEl.addEventListener('click', (e)=>{
    modal.classList.add('show');

    // const mealInfo = e.path.find(item => {
    //     if(item.classList) {
    //         return item.classList.contains('meal-info');     
    //     } else {
    //         return false;
    //     }   
    // })
    const mealInfo = e.composedPath().find(function returnItemWithClass(item){
        if(item.classList) {
            return item.classList.contains('meal-info');     
        } else {
            return false;
        }   
    })

    if(mealInfo){
        const mealID = mealInfo.getAttribute('data-mealID');
        getMealById(mealID);
    }

   
})

close.addEventListener('click', ()=>{
    modal.classList.remove('show');
})

window.addEventListener('click', (e)=>{
    if(e.target.classList.contains('modal-container')) {
        modal.classList.remove('show');
    }
})

