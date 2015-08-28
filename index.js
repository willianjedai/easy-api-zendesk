"use strict";

var config = require('./config'),
  request = require('request');

var updateMany = process.env.updateMany || false,
  deleteMany = process.env.deleteMany || false;

if(updateMany && updateMany.indexOf(',') > -1) {
  updateMany = updateMany.split(',');
}
//console.log(config);

var requestApi = function(settings, cb) {
  cb = cb || function() {};
  console.log('getting zendesk');

  request({
    url: config.api_path + settings.path,
    method: settings.method,
    json: settings.json,
    auth: {
      user: config.user + '/token',
      pass: config.apitoken,
      sendImmediately: false
    }
  }, cb);

  console.log('Getted zendesk');
};

var updateOrganizations = function() {
  var organizations = [];

  for(var i = 0, c = updateMany.length; i < c; i++) {
    organizations.push({
      id: updateMany[i],
      name: 'Vai deletar ' + updateMany[i]
    });
  }

  console.log('Updating many organizations', organizations);
  requestApi({
    method: 'PUT',
    path: 'organizations/update_many.json',
    json: {
      organizations: organizations
    }
  }, function(err, response, body) {
    console.log(err, response.statusCode, body);
  });
};

var deleteOrganizations = function() {
  console.log('Deleting many organizations', deleteMany);
  requestApi({
    method: 'DELETE',
    path: 'organizations/destroy_many.json?ids=' + deleteMany
  }, function(err, response, body) {
    console.log(err, response.statusCode, body);
  });
};

if(updateMany && typeof updateMany === 'object' && updateMany.length > 0) {
  updateOrganizations();
}

if(deleteMany && typeof deleteMany === 'string') {
  deleteOrganizations();
}