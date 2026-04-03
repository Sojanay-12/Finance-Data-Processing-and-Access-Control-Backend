export async function errorMiddleware(error, req, res, next){
    res.status(500).json({
      success: false,
      message: error?.message || "Something went wrong"
    })
}