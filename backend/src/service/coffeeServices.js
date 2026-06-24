import { pool } from '../config/db.js';
import 'dotenv/config';

const TABLE = 'usuarios';

class coffeService {

    async getAll() {
        try {
            const result = await pool.query(
                `SELECT * FROM ${TABLE} ORDER BY id_usuario`
            );
            return result.rows;
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            throw new Error(error.message);
        }
    }

    async getById(id) {
        try {
            const result = await pool.query(
                `SELECT * FROM ${TABLE} WHERE id_usuario = $1`,
                [id]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Erro ao buscar usuário por id:', error);
            throw new Error(error.message);
        }
    }

    async create(data) {
        try {
            const { nome_usuario, email_usuario, senha_usuario, telefone_usuario } = data;
            const result = await pool.query(
                `INSERT INTO ${TABLE} (nome_usuario, email_usuario, senha_usuario, telefone_usuario) 
                 VALUES ($1, $2, $3, $4) RETURNING *`,
                [nome_usuario, email_usuario, senha_usuario, telefone_usuario]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            throw new Error(error.message);
        }
    }

    async update(id, data) {
        try {
            const { nome_usuario, email_usuario, senha_usuario, telefone_usuario } = data;
            const result = await pool.query(
                `UPDATE ${TABLE} SET nome_usuario = $1, email_usuario = $2, 
                 senha_usuario = $3, telefone_usuario = $4 
                 WHERE id_usuario = $5 RETURNING *`,
                [nome_usuario, email_usuario, senha_usuario, telefone_usuario, id]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            throw new Error(error.message);
        }
    }

    async patch(id, data) {
        try {
            const atual = await this.getById(id);

            if (!atual) throw new Error('Usuário não encontrado');

            const nome_usuario = data.nome_usuario ?? atual.nome_usuario;
            const email_usuario = data.email_usuario ?? atual.email_usuario;
            const senha_usuario = data.senha_usuario ?? atual.senha_usuario;
            const telefone_usuario = data.telefone_usuario ?? atual.telefone_usuario;

            const result = await pool.query(
                `UPDATE ${TABLE} SET nome_usuario = $1, email_usuario = $2, 
                 senha_usuario = $3, telefone_usuario = $4 
                 WHERE id_usuario = $5 RETURNING *`,
                [nome_usuario, email_usuario, senha_usuario, telefone_usuario, id]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Erro ao atualizar parcialmente usuário:', error);
            throw new Error(error.message);
        }
    }

    async delete(id) {
        try {
            const result = await pool.query(
                `DELETE FROM ${TABLE} WHERE id_usuario = $1 RETURNING *`,
                [id]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            throw new Error(error.message);
        }
    }
}

export default new coffeService();