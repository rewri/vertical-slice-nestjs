# Guideline: Arquitetura Vertical Slice em NestJS

## 📋 Visão Geral

Este guideline apresenta como implementar a arquitetura **Vertical Slice** em projetos NestJS, organizando o código por funcionalidades completas ao invés de camadas técnicas.

## 🏗️ Estrutura Base do Projeto

```
src/
├── app.module.ts
├── main.ts
├── core/                    # Infraestrutura compartilhada
│   ├── database/
│   └── shared/
│       ├── dto/            # DTOs reutilizáveis
│       └── helpers/        # Utilitários compartilhados
└── features/               # Features organizadas por domínio
    └── [domain]/           # Ex: users, products, orders
        ├── [domain].module.ts
        ├── [action]/       # Ex: create-user, list-users
        │   ├── [action].controller.ts
        │   ├── [action].service.ts
        │   ├── [action].dto.ts
        │   └── [action].module.ts
        └── shared/         # Compartilhado apenas no domínio
            ├── entities/
            └── repositories/
```

## 🚀 Passo a Passo para Implementação

### 1. Configuração Inicial

#### AppModule

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    // Importar módulos de domínio
    UsersModule,
    ProductsModule,
    // ... outros domínios
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### 2. Estrutura do Core

#### Core/Database

- `database.module.ts` - Configuração da conexão
- `database.provider.ts` - Provider da fonte de dados

#### Core/Shared

- **DTOs**: Tipos reutilizáveis (paginação, filtros)
- **Helpers**: Utilitários compartilhados entre domínios

### 3. Criando um Novo Domínio

#### Passo 3.1: Módulo do Domínio

```typescript
// features/products/products.module.ts
@Module({
  imports: [
    CreateProductModule,
    ListProductsModule,
    UpdateProductModule,
    // ... outras ações
  ],
})
export class ProductsModule {}
```

#### Passo 3.2: Entidade Compartilhada

```typescript
// features/products/shared/entities/product.entity.ts
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // ... outros campos
}
```

#### Passo 3.3: Repository Compartilhado

```typescript
// features/products/shared/repositories/product.repository.ts
@Injectable()
export class ProductRepository {
  private productRepository: Repository<Product>;

  constructor(@Inject('DATA_SOURCE') private dataSource: DataSource) {
    this.productRepository = this.dataSource.getRepository(Product);
  }

  // Métodos específicos do domínio
  async create(data: CreateProductDTO): Promise<Product> {}
  async findAll(): Promise<Product[]> {}
  // ...
}
```

### 4. Implementando uma Nova Feature (Slice)

#### Passo 4.1: Criar a Estrutura da Feature

```
features/products/create-product/
├── create-product.controller.ts
├── create-product.service.ts
├── create-product.dto.ts
└── create-product.module.ts
```

#### Passo 4.2: DTO da Feature

```typescript
// create-product.dto.ts
export class CreateProductDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;

  // Validações específicas da feature
}
```

#### Passo 4.3: Service da Feature

```typescript
// create-product.service.ts
@Injectable()
export class CreateProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(dto: CreateProductDTO): Promise<Product> {
    // Lógica de negócio específica desta feature
    // Validações
    // Transformações
    return await this.productRepository.create(dto);
  }
}
```

#### Passo 4.4: Controller da Feature

```typescript
// create-product.controller.ts
@Controller('products')
export class CreateProductController {
  constructor(private readonly service: CreateProductService) {}

  @Post()
  async handle(@Body() dto: CreateProductDTO) {
    return this.service.execute(dto);
  }
}
```

#### Passo 4.5: Module da Feature

```typescript
// create-product.module.ts
@Module({
  imports: [DatabaseModule],
  controllers: [CreateProductController],
  providers: [CreateProductService, ProductRepository],
})
export class CreateProductModule {}
```

## 🎯 Princípios da Arquitetura Vertical Slice

### ✅ O Que Fazer

1. **Uma feature = Um slice completo**
   - Controller, Service, DTO e Module próprios
   - Funcionalidade independente e testável

2. **Compartilhamento no nível correto**
   - Entities e Repositories: compartilhados no domínio
   - DTOs e Helpers: compartilhados globalmente se necessário

3. **Responsabilidade única**
   - Cada slice resolve apenas um caso de uso
   - Services focados na lógica de negócio específica

4. **Módulos granulares**
   - Cada feature tem seu próprio módulo
   - Imports mínimos e necessários

### ❌ O Que Evitar

1. **Não criar slices muito genéricos**
   - Evite services que fazem "tudo"
   - Prefira múltiplos slices específicos

2. **Não misturar responsabilidades**
   - Controller não deve ter lógica de negócio
   - Service não deve conhecer detalhes HTTP

3. **Não compartilhar desnecessariamente**
   - Se algo é usado apenas em uma feature, mantenha lá
   - Só mova para shared quando realmente necessário

## 📁 Exemplo Prático: Feature de Lista com Filtros

```typescript
// list-products.dto.ts
export class ListProductsDTO extends PaginationQueryDTO {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ProductCategory)
  category?: ProductCategory;
}

// list-products.service.ts
@Injectable()
export class ListProductsService {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(query: ListProductsDTO) {
    const { data, total } =
      await this.productRepository.findAllPaginated(query);
    return PaginationHelper.createResponse(data, total, query);
  }
}
```

## 🔄 Evoluindo a Arquitetura

1. **Novos domínios**: Seguir a mesma estrutura
2. **Novas features**: Criar novos slices independentes
3. **Código compartilhado**: Mover para shared quando usado por 2+ features
4. **Refatorações**: Quebrar slices grandes em menores

## 📋 Checklist para Nova Feature

- [ ] Criar diretório da feature em `/features/[domain]/[action]/`
- [ ] Implementar DTO com validações
- [ ] Criar Service com lógica de negócio
- [ ] Implementar Controller com endpoints
- [ ] Configurar Module com dependências
- [ ] Adicionar ao módulo do domínio
- [ ] Documentar endpoints (Swagger)

---
