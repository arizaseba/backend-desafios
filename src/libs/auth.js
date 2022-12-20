const checkIfAdminMiddleware = (req, res, next) => {
    const ADMIN = true;
    //  const userType = req.header("userType")
    // userType === ADMIN
    ADMIN
        ? next()
        : res.status(401).json({ status: "Unauthorized", data: "Usuario no autorizado" })
}

export default checkIfAdminMiddleware;