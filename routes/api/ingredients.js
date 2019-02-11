const express = require('express');
const router = express.Router();
const api_ingredients_controller = require('../../controllers/api/ingredients');
const auth_controller = require('../../controllers/auth/auth')

router.get('/', api_ingredients_controller.ingredient_get_all);

router.get('/search', api_ingredients_controller.ingredient_get_search_tag);

router.get('/:id', api_ingredients_controller.ingredient_get_id);

router.post('/create', api_ingredients_controller.ingredient_create_post);

router.put('/:id', api_ingredients_controller.ingredient_put_id);

router.get('*', (req, res) => {
    res.status(400).json({code: 404, error: 'resource not found'});
});

module.exports = router;


