import { DataTypes, Model, Sequelize } from 'sequelize';

// Initialize Sequelize connection
const sequelize = new Sequelize('e_commerce', 'postgres', 'premkumar2132', {
  dialect: 'postgres', 
  host: 'localhost',
});

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

class Cart extends Model {
  quantity: any;
}

Cart.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
}, {
  sequelize,
  modelName: 'Cart',
  tableName: 'carts',
});

class Product extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public price!: number;
  public discountPercentage!: number;
  public stock!: number;
  public brand!: string;
  public category!: string;
  public thumbnail!: string;
}

class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
  public createdAt!: Date;
  public role?: UserRole;
  public secret_key?:string
}

Product.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
  price: {
    type: DataTypes.FLOAT, 
    allowNull: false,
  },
  discountPrice: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
  stock:{
    type:DataTypes.INTEGER,
    allowNull:false
  }
}, {
  sequelize,
  modelName: 'Product',
  tableName: 'products', 
});

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }, 
  role: { 
    type: DataTypes.ENUM(...Object.values(UserRole)),
    allowNull: false,
    defaultValue: UserRole.USER, 
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  secret_key: {
    type: DataTypes.STRING,
    allowNull: true
  }, 
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users', 
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
    await sequelize.sync();
    console.log('Models synchronized with the database.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
User.hasMany(Cart, { foreignKey: "userId" });
Cart.belongsTo(User, { foreignKey: "userId" });

Product.hasMany(Cart, { foreignKey: "productId" });
Cart.belongsTo(Product, { foreignKey: "productId" });

export { Product, User, Cart };
