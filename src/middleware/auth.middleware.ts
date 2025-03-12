import { Request, Response, NextFunction } from 'express'

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const { isLoggedIn } = req.signedCookies
  if (!isLoggedIn) {
    res.status(401).redirect('forbidden')
    return
  }
  next()
}