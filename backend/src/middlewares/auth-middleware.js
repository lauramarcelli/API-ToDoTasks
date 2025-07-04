const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization
    if(!authHeader)
        return res.status(401).json({error: 'Token requerido'})

    const token = authHeader.split(' ')[1]
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log('Token decodificado:', decoded)
        req.userId = decoded.id
        console.log('userId asignado:', req.userId)
        next()
    } catch (err) {
        console.error('Error verificando token:', err)
        return res.status(403).json({ error: 'Token inválido'})
    }
}

