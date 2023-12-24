import { app } from '../app_express'
// import ViteExpress from 'vite-express'

const port = Number(process.env.PORT) || 3000

app.listen(port, () => {
  console.log(
    '\x1b[36m%s\x1b[0m',
    'Server is running at http://localhost:' + port,
  )
})

// ViteExpress.listen(app, port)
