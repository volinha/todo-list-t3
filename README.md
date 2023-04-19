# Todo-List T3

This is a [T3 Stack](https://create.t3.gg/) Todo-List project bootstrapped with `create-t3-app`.

## 🤔 How to use

### ⌨️ Installation

- Clone this repo and navigate to project folder:

``` bash
$ git clone https://github.com/volinha/todo-list-t3
$ cd todo-list-t3
$ npm install
```

- Rename `.env.example` in the root folder to `.env`

- Update Prisma database:
``` bash
$ npx prisma db push
```

- Run the project:
``` bash
$ npm run dev
```

- Click on Login and put any email (doesn't need to be a real one) and check terminal for the `LOGIN LINK` and enter on it to validate email (shows only in dev mode, only if there's not a `.NODE_ENV` variable set to send the validation link).
## 👣 Steps

- [x] npm create t3-app@latest

### Backend

- [x] Update Prisma scheme
- [x] Add email auth provider
- [x] Create TRPC router for the *Todos*

### Frontend

- [x] Login
- [x] List Todos
- [x] Create Todos
- [x] Toggle Todo
- [x] Delete Todo
- [ ] Updates

## 🔧 Tools

- [T3 Stack](https://create.t3.gg)
- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)