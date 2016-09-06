/**
 * Created by kras on 22.08.16.
 */
var fs = require('fs');
var path = require('path');
const appDeployer = require('./appSetup');

module.exports = function (appDir) {
  return new Promise(function (resolve, reject) {
    console.log('Установка приложения ' + appDir);
    var dep = null;
    var depPath = path.join(appDir, 'deploy.json');
    try {
      fs.accessSync(depPath);
      dep = JSON.parse(fs.readFileSync(depPath));
    } catch (err) {
      console.warn('Не удалось прочитать конфигурацию развертывания.');
    }

    var worker;
    if (dep) {
      if (dep.deployer) {
        if (dep.deployer === 'built-in') {
          if (typeof dep.modules === 'object') {
            worker = function () {
              return appDeployer(dep.modules);
            };
          }
        } else {
          worker = require(dep.deployer);
        }
        if (typeof worker === 'function') {
          console.log('Выполняется скрипт развертывания приложения');
          worker().then(function () { resolve(dep); }).catch(reject);
          return;
        }
      }
    }
    resolve(dep);
  });
};