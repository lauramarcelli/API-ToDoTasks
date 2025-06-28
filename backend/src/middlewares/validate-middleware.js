module.exports = {
    auth: (req, res, next) => {
        const { email, password} = req.body
        if(!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son requeridos' })
        }
        next()
    },
    
    task: (req, res, next) => {
        const { title } = req.body
        if (!title) {
            return res.status(400).json({ error: 'Título es requerido' })
        }
        next()
    },

    taskUpdate: (req, res, next) => {
        if(!req.body.title && req.body.completed === undefined) {
            return res.status(400).json({
                error: 'Se requiere al menos un campo para actualizar la tarea'})
        }
        next()
    }
}