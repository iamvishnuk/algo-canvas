project-root/
│
├── shared/ # Shared kernel across modules
│ ├── config/
│ │ ├── database.config.ts
│ │ ├── app.config.ts
│ │ └── env.config.ts
│ │
│ ├── constants/
│ │ ├── error-codes.ts
│ │ └── app-constants.ts
│ │
│ ├── interfaces/
│ │ ├── base-repository.interface.ts
│ │ ├── base-entity.interface.ts
│ │ └── response.interface.ts
│ │
│ ├── utils/
│ │ ├── logger.util.ts
│ │ ├── validator.util.ts
│ │ └── error-handler.util.ts
│ │
│ ├── middleware/
│ │ ├── error.middleware.ts
│ │ ├── auth.middleware.ts
│ │ └── validation.middleware.ts
│ │
│ └── types/
│ └── common.types.ts
│
├── modules/
│ │
│ ├── user/
│ │ ├── domain/
│ │ │ ├── entities/
│ │ │ │ └── user.entity.ts
│ │ │ ├── repositories/
│ │ │ │ └── user.repository.interface.ts
│ │ │ └── value-objects/
│ │ │ └── email.vo.ts
│ │ │
│ │ ├── application/
│ │ │ ├── use-cases/
│ │ │ │ ├── create-user.use-case.ts
│ │ │ │ ├── get-user.use-case.ts
│ │ │ │ └── update-user.use-case.ts
│ │ │ ├── dtos/
│ │ │ │ ├── create-user.dto.ts
│ │ │ │ └── update-user.dto.ts
│ │ │ └── services/
│ │ │ └── user.service.ts
│ │ │
│ │ ├── infrastructure/
│ │ │ ├── persistence/
│ │ │ │ ├── user.model.ts
│ │ │ │ └── user.repository.ts
│ │ │ └── mappers/
│ │ │ └── user.mapper.ts
│ │ │
│ │ └── presentation/
│ │ ├── controllers/
│ │ │ └── user.controller.ts
│ │ ├── routes/
│ │ │ └── user.routes.ts
│ │ └── validators/
│ │ └── user.validator.ts
│ │
│ ├── auth/
│ │ ├── domain/
│ │ │ ├── entities/
│ │ │ │ └── auth-session.entity.ts
│ │ │ └── repositories/
│ │ │ └── auth.repository.interface.ts
│ │ │
│ │ ├── application/
│ │ │ ├── use-cases/
│ │ │ │ ├── login-email.use-case.ts
│ │ │ │ ├── login-google.use-case.ts
│ │ │ │ ├── register.use-case.ts
│ │ │ │ ├── refresh-token.use-case.ts
│ │ │ │ └── logout.use-case.ts
│ │ │ ├── dtos/
│ │ │ │ ├── login.dto.ts
│ │ │ │ └── register.dto.ts
│ │ │ └── services/
│ │ │ ├── auth.service.ts
│ │ │ ├── token.service.ts
│ │ │ └── google-auth.service.ts
│ │ │
│ │ ├── infrastructure/
│ │ │ ├── persistence/
│ │ │ │ ├── auth-session.model.ts
│ │ │ │ └── auth.repository.ts
│ │ │ ├── strategies/
│ │ │ │ ├── jwt.strategy.ts
│ │ │ │ └── google.strategy.ts
│ │ │ └── mappers/
│ │ │ └── auth.mapper.ts
│ │ │
│ │ └── presentation/
│ │ ├── controllers/
│ │ │ └── auth.controller.ts
│ │ ├── routes/
│ │ │ └── auth.routes.ts
│ │ └── validators/
│ │ └── auth.validator.ts
│ │
│ └── canvas/
│ ├── domain/
│ │ ├── entities/
│ │ │ ├── canvas.entity.ts
│ │ │ └── canvas-element.entity.ts
│ │ └── repositories/
│ │ └── canvas.repository.interface.ts
│ │
│ ├── application/
│ │ ├── use-cases/
│ │ │ ├── create-canvas.use-case.ts
│ │ │ ├── update-canvas.use-case.ts
│ │ │ ├── get-canvas.use-case.ts
│ │ │ └── delete-canvas.use-case.ts
│ │ ├── dtos/
│ │ │ ├── create-canvas.dto.ts
│ │ │ └── update-canvas.dto.ts
│ │ └── services/
│ │ └── canvas.service.ts
│ │
│ ├── infrastructure/
│ │ ├── persistence/
│ │ │ ├── canvas.model.ts
│ │ │ └── canvas.repository.ts
│ │ └── mappers/
│ │ └── canvas.mapper.ts
│ │
│ └── presentation/
│ ├── controllers/
│ │ └── canvas.controller.ts
│ ├── routes/
│ │ └── canvas.routes.ts
│ └── validators/
│ └── canvas.validator.ts
│
├── app.ts # Express app setup
├── server.ts # Server entry point
├── package.json
├── tsconfig.json
└── .env
