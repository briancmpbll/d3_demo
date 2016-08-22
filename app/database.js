const Sequelize = require('sequelize');

let sequelize = new Sequelize('demo-db', null, null, {
  dialect: 'sqlite',
  storage: ':memory:',
  benchmark: true
});

let Data = sequelize.define('data', {
  date: Sequelize.DATEONLY,
  value: Sequelize.FLOAT
});

sequelize.sync({force: true})
.then(()=> {
  // Seed database with some data.
  sequelize.transaction(t=> {
    let promises = [];

    promises.push(Data.create({date: new Date('26-Mar-12'), value: 606.98}, {transaction: t}));
    promises.push(Data.create({date: new Date('27-Mar-12'), value: 614.48}, {transaction: t}));
    promises.push(Data.create({date: new Date('28-Mar-12'), value: 617.62}, {transaction: t}));
    promises.push(Data.create({date: new Date('29-Mar-12'), value: 609.86}, {transaction: t}));
    promises.push(Data.create({date: new Date('30-Mar-12'), value: 599.55}, {transaction: t}));
    promises.push(Data.create({date: new Date('2-Apr-12'), value: 618.63}, {transaction: t}));
    promises.push(Data.create({date: new Date('3-Apr-12'), value: 629.32}, {transaction: t}));
    promises.push(Data.create({date: new Date('4-Apr-12'), value: 624.31}, {transaction: t}));
    promises.push(Data.create({date: new Date('5-Apr-12'), value: 633.68}, {transaction: t}));
    promises.push(Data.create({date: new Date('9-Apr-12'), value: 636.23}, {transaction: t}));
    promises.push(Data.create({date: new Date('10-Apr-12'), value: 628.44}, {transaction: t}));
    promises.push(Data.create({date: new Date('11-Apr-12'), value: 626.20}, {transaction: t}));
    promises.push(Data.create({date: new Date('12-Apr-12'), value: 622.77}, {transaction: t}));
    promises.push(Data.create({date: new Date('13-Apr-12'), value: 605.23}, {transaction: t}));
    promises.push(Data.create({date: new Date('16-Apr-12'), value: 580.13}, {transaction: t}));
    promises.push(Data.create({date: new Date('17-Apr-12'), value: 543.70}, {transaction: t}));
    promises.push(Data.create({date: new Date('18-Apr-12'), value: 443.34}, {transaction: t}));
    promises.push(Data.create({date: new Date('19-Apr-12'), value: 345.44}, {transaction: t}));
    promises.push(Data.create({date: new Date('20-Apr-12'), value: 234.98}, {transaction: t}));
    promises.push(Data.create({date: new Date('23-Apr-12'), value: 166.70}, {transaction: t}));
    promises.push(Data.create({date: new Date('24-Apr-12'), value: 130.28}, {transaction: t}));
    promises.push(Data.create({date: new Date('25-Apr-12'), value: 99.00}, {transaction: t}));
    promises.push(Data.create({date: new Date('26-Apr-12'), value: 89.70}, {transaction: t}));
    promises.push(Data.create({date: new Date('27-Apr-12'), value: 67.00}, {transaction: t}));
    promises.push(Data.create({date: new Date('30-Apr-12'), value: 53.98}, {transaction: t}));
    promises.push(Data.create({date: new Date('1-May-12'), value: 58.13}, {transaction: t}));

    return Sequelize.Promise.all(promises);
  })
  .then(()=> {
    console.log('All seed data inserted');
  });
});

let lastDay = new Date('1-May-12');
let lastValue = 58.13;

module.exports = {
  // Get the latest 20 data points.
  getLatestData: callback=> {
    return Data.findAll({
      attributes: ['date', 'value'],
      order: [
        ['date', 'DESC']
      ],
      limit: 20
    });
  },

  // Fake some random data for the next day and return the promise.
  addData: callback=> {
    lastDay.setDate(lastDay.getDate() + 1);
    lastValue += -20 + (Math.random() * 40);

    if (lastValue < 0) {
      lastValue *= -1;
    }

    return Data.create({
      date: lastDay,
      value: lastValue
    });
  }
};
