import { Router, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { checkAuth } from '../middleware/auth.middleware'
import { User } from '../types/user'

const pageRouter = Router()

const users: User[] = [
  { id: uuidv4(), username: 'admin', password: 'admin12345'},
]

// Routes
// Home page
pageRouter.get('/', (req: Request, res: Response) => {
  res.status(200).render('index')
})

// Login page
pageRouter.get('/login', (req: Request, res: Response) => {
  res.status(200).render('login')
})

// Login logic
pageRouter.post('/login', (req: Request<{}, {}, Omit<User, 'id'>>, res: Response) => {
  const { username, password } = req.body
  const user = users.find(user => user.username === username && user.password === password)
  if (user) {
    res.status(404).redirect('/login')
    return
  }
  res.cookie('isLoggedIn', true, {
    httpOnly: true,
    maxAge: 60 * 1000,
    signed: true
  })
  res.cookie('username', username, {
    httpOnly: true,
    maxAge: 60 * 1000,
    signed: true
  })
  res.status(201).redirect('/profile')
})

// Logout logic
pageRouter.get('/logout', (req: Request, res: Response) => {
  res.clearCookie('isLoggedIn')
  res.clearCookie('username')
  res.status(301).redirect('/login')
})

pageRouter.get('/check', (req: Request, res: Response) => {
  const { username } = req.signedCookies
  res.status(200).json({ username })
})

// Protected Profile page
pageRouter.get('/profile', checkAuth, (req: Request, res: Response) => {
  res.status(200).render('profile')
})

export default pageRouter