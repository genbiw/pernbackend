const { sequelize1, sequelize2 } = require("../db");
const {DataTypes} = require("sequelize") 

const User = sequelize1.define("user", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    phoneNumber: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
    userName: {type: DataTypes.STRING},
    age: {type: DataTypes.INTEGER},
    gender: {type: DataTypes.ENUM("male", "female")},
    city: {type: DataTypes.STRING},
    address: {type: DataTypes.STRING},
    country: {type: DataTypes.STRING}
})

const Basket = sequelize1.define("basket", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
})

const BasketDevice = sequelize1.define("basket_device", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    quantity: {type: DataTypes.INTEGER, defaultValue: 1}
})

const Device = sequelize1.define("device", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    rating: {type: DataTypes.INTEGER, defaultValue: 0},
    img: {type: DataTypes.STRING, allowNull: false}
})

const Type = sequelize1.define("type", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false}
})

const Brand = sequelize1.define("brand", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false}
})

const Rating = sequelize1.define("rating", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    rate: {type: DataTypes.INTEGER, allowNull: false}
})

const DeviceInfo = sequelize1.define("device_info", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false}
})

const TypeBrand = sequelize1.define("type_brand", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

User.hasOne(Basket)
Basket.belongsTo(User)

User.hasMany(Rating)
Rating.belongsTo(User)

Basket.hasMany(BasketDevice)
BasketDevice.belongsTo(Basket)

Type.hasMany(Device)
Device.belongsTo(Type)

Brand.hasMany(Device)
Device.belongsTo(Brand)

Device.hasMany(Rating)
Rating.belongsTo(Device)

Device.hasMany(BasketDevice)
BasketDevice.belongsTo(Device)

Device.hasMany(DeviceInfo, {as:"info"}) 
DeviceInfo.belongsTo(Device)

Type.belongsToMany(Brand, {through: TypeBrand})
Brand.belongsToMany(Type, {through: TypeBrand})






const User2 = sequelize2.define("user", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
    name: {type: DataTypes.STRING},
    age: {type: DataTypes.INTEGER},
    gender: {type: DataTypes.ENUM("male", "female"), defaultValue: "male"},
    city: {type: DataTypes.STRING},
    address: {type: DataTypes.STRING},
    country: {type: DataTypes.STRING}
})

const Basket2 = sequelize2.define("basket", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
})

const BasketDevice2 = sequelize2.define("basket_device", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    quantity: {type: DataTypes.INTEGER, defaultValue: 1}
})

const Device2 = sequelize2.define("device", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    rating: {type: DataTypes.INTEGER, defaultValue: 0},
    img: {type: DataTypes.STRING, allowNull: false}
})

const Type2 = sequelize2.define("type", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false}
})

const Brand2 = sequelize2.define("brand", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false}
})

const Rating2 = sequelize2.define("rating", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    rate: {type: DataTypes.INTEGER, allowNull: false}
})

const DeviceInfo2 = sequelize2.define("device_info", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false}
})

const TypeBrand2 = sequelize2.define("type_brand", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

User2.hasOne(Basket2)
Basket2.belongsTo(User2)

User2.hasMany(Rating2)
Rating2.belongsTo(User2)

Basket2.hasMany(BasketDevice2)
BasketDevice2.belongsTo(Basket2)

Type2.hasMany(Device2)
Device2.belongsTo(Type2)

Brand2.hasMany(Device2)
Device2.belongsTo(Brand2)

Device2.hasMany(Rating2)
Rating2.belongsTo(Device2)

Device2.hasMany(BasketDevice2)
BasketDevice2.belongsTo(Device2)

Device2.hasMany(DeviceInfo2, {as:"info"}) 
DeviceInfo2.belongsTo(Device2)

Type2.belongsToMany(Brand2, {through: TypeBrand2})
Brand2.belongsToMany(Type2, {through: TypeBrand2})




module.exports = {
    User,
    Basket,
    BasketDevice,
    Device,
    Type,
    Brand,
    Rating,
    TypeBrand,
    DeviceInfo,
    User2,
    Basket2,
    BasketDevice2,
    Device2,
    Type2,
    Brand2,
    Rating2,
    TypeBrand2,
    DeviceInfo2
}