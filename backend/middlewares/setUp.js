export const setUp = (req, res, next) => {
    if(!req.files){
        req.files = {}
    }
    next()
}