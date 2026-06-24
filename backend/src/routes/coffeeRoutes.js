import coffeeService from '../service/coffeeServices.js';
import express from 'express';

export const coffeeRoute = express.Router();

coffeeRoute.get('/', async (req, res) => {
    try {
        const coffee = await coffeeService.getAll();
        res.json(coffee);
    } catch (error) {
        console.error('Erro ao listar coffee:', error);
        res.status(500).json({ message: error.message });
    }
});


coffeeRoute.get('/:id', async (req, res) => {
    try {
        const coffee = await coffeeService.getById(req.params.id);

        if (!coffee) return res.status(404).json({ message: 'Não encontrado' });

        res.json(coffee);
    } catch (error) {
        console.error('Erro ao buscar coffee por ID:', error);
        res.status(500).json({ message: error.message });
    }
});


coffeeRoute.post('/', async (req, res) => {
    try {
        const coffee = await coffeeService.create(req.body);
        res.status(201).json(coffee);
    } catch (error) {
        console.error('Erro ao criar coffee:', error);
        res.status(500).json({ message: error.message });
    }
});


coffeeRoute.put('/:id', async (req, res) => {
    try {
        const coffee = await coffeeService.update(req.params.id, req.body);

        if (!coffee) return res.status(404).json({ message: 'Não encontrado' });

        res.json(coffee);
    } catch (error) {
        console.error('Erro ao atualizar usuarios:', error);
        res.status(500).json({ message: error.message });
    }
});


coffeeRoute.patch('/:id', async (req, res) => {
    try {
        const coffee = await coffeeService.patch(req.params.id, req.body);

        if (!coffee) return res.status(404).json({ message: 'Não encontrado' }); 

        res.json(coffee);
    } catch (error) {
        console.error('Erro ao atualizar parcialmente o usuario:', error);
        res.status(500).json({ message: error.message });
    }
});


coffeeRoute.delete('/:id', async (req, res) => {
    try {
        const coffee = await coffeeService.delete(req.params.id);

        if (!coffee) return res.status(404).json({ message: 'Não encontrado' });

        res.json(coffee);
    } catch (error) {
        console.error('Erro ao excluir usuario:', error);
        res.status(500).json({ message: error.message });
    }
});