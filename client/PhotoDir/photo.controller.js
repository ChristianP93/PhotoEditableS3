(function(){
  'use strict';

  angular
    .module('myApp')
      .controller('PhotoController', PhotoController);

      PhotoController.$inject=['Storage', '$uibModal', '$uibModalInstance', 'divId'];

      function PhotoController(Storage, $uibModal, $uibModalInstance, divId){
        var vm = this;
        vm.cropper = {};
        vm.cropper.sourceImage = null;
        vm.cropper.croppedImage  = null;
        vm.bounds = {};
        vm.bounds.left = 0;
        vm.bounds.right = 0;
        vm.bounds.top = 0;
        vm.bounds.bottom = 0;

        vm.caricaIMG = function(element) {
          var imgFile = element.files[0];
          vm.imageloaded = imgFile;
        };

        vm.base64ToArrayBuffer = function(base64) {
          var byteString = atob(base64.split(',')[1]);
          var mimeString = base64.split(',')[0].split(':')[1].split(';')[0];

          var arrayB = new ArrayBuffer(byteString.length);
          var unitA = new Uint8Array(arrayB);

          for (var i = 0; i < byteString.length; i++) {
              unitA[i] = byteString.charCodeAt(i);
          }

          var blobFile = new Blob([arrayB],{type: mimeString});
          return blobFile
        }

        vm.putAndSave = function() {

          var icon = vm.imageloaded;
          if(icon != "undefined" && icon != undefined && icon !="" && icon != null) {
            var extension = icon.name.substr(icon.name.lastIndexOf(".") + 1);

            Storage.getForPublicWrite(extension, icon.type).then(function(response){
              if (response.data.result.signedUrl) {
                vm.filenameImg = response.data.result.filename;

                var reader = new FileReader();
                reader.onload = function(e){

                  Storage.putX(response.data.result.signedUrl, reader.result, icon).then(function(putResponse, putStatus, putHeaders, putConfig) {
                    alert("Success");

                    Storage.get(response.data.result.filename).then(function(datafoto){
                      var signedUrl =  datafoto.data.result.signedUrl;

                      var find = angular.element( document.querySelector( '#'+divId ) );

                      find.attr('src', signedUrl);

                      $uibModalInstance.dismiss(vm.filenameImg);

                    }).catch(function(err){
                      return err
                    })
                  }).catch(function(putResponse, putStatus, putHeaders, putConfig){
                    alert("Errore #" + putStatus);
                  });
                };
                reader.readAsArrayBuffer(vm.base64ToArrayBuffer(vm.cropper.croppedImage));
              } reader.result
            }).catch(function(err){
              return err;
            });
          }else{
            alert("Seleziona una nuova immagine");
          }
        };

        vm.activeWebcam = function() {
          vm.ciao="ciao";
        };


        vm.putAndSaveWeb = function() {
          var photo;
          photo = new File([vm.profilo.avatar], 'profile.jpg');
          var icon = vm.base64ToArrayBuffer(vm.profilo.avatar);
          if(icon != "undefined" && icon != undefined && icon !="" && icon != null) {

            var extension = photo.name.substr(photo.name.lastIndexOf(".") + 1);
            Storage.getForPublicWrite(extension, icon.type).then(function(response){
              if (response.data.result.signedUrl) {
                vm.filenameImg = response.data.result.filename;
                var reader = new FileReader();
                reader.onload = function(e){

                  Storage.putX(response.data.result.signedUrl, reader.result, icon).then(function(putResponse, putStatus, putHeaders, putConfig) {
                    alert("Salvataggio Riuscito");
                    Storage.get(vm.filenameImg).then(function(response){

                      var find = angular.element( document.querySelector( '#'+divId ) );
                      find.attr('src',response.data.result.signedUrl);
                      $uibModalInstance.dismiss(vm.filenameImg);
                    }).catch(function(err){
                      return err
                    })

                  })
                  .catch(function(putResponse, putStatus, putHeaders, putConfig){
                    alert("Errore #" + putStatus);
                  });
                };

                reader.readAsArrayBuffer(vm.base64ToArrayBuffer(vm.profilo.avatar));

              } reader.result
            }).catch(function(err){
              return err;
            });
          }else{
            alert("Seleziona una nuova immagine");
          }
        };

      }
})();
