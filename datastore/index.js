const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, data) => {
    if (err) {
      callback(new Error('Error getting unique file ID'));
    } else {
      var id = data;
      var fileName = id + '.txt';
      var filePath = path.join(exports.dataDir, fileName);
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          callback(new Error('Error creating file'));
        } else {
          callback(null, {id: id, text: text});
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files)=> {
    if (err) {
      callback(new Error('Error reading todos'));
    } else {
      var result = [];
      files.map((file) => {
        result.push({id: file.slice(0, 5), text: file.slice(0, 5)});
      });
      callback(null, result);
    }
  });
};

exports.readOne = (id, callback) => {
  var filePath = exports.dataDir + '/' + id + '.txt';
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, {id: id, text: data});
    }
  });


};

exports.update = (id, text, callback) => {
  var filePath = exports.dataDir + '/' + id + '.txt';

  fs.access(filePath, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(filePath, text, (err, data) => {
        if (err) {
          callback(new Error(`Error writing to file with id: ${id}`));
        } else {
          callback(null, {id: id, text: text});
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var filePath = exports.dataDir + '/' + id + '.txt';
  fs.unlink(filePath, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
