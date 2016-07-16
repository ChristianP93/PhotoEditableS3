angular.module('myApp')
  .directive('photoEditable', ['Storage', '$uibModal', function(Storage, $uibModal, PhotoController){

    function link (scope, elm, attrs, ctrls){
      var ngModel = ctrls[0];
      ngModel.$render = function() {
        imageFilename = ngModel.$viewValue || '1455796977185_56bb0510f70bb0026aec7b4b.png';
        var divId =  'photo-'+(((1+Math.random())*0x10000)|0).toString(16);

        return Storage.get( imageFilename ).success(function(dataphoto, status, headers, config) {
          if(attrs.uploadimg){
            if (imageFilename === '1455796977185_56bb0510f70bb0026aec7b4b.png')dataphoto.result.signedUrl = '';
            elm.html('<img id="'+divId+'" class="'+attrs.typeimage+'" alt="' + attrs.uploadimg + '" src="'+dataphoto.result.signedUrl+'">');
          }else if (!attrs.uploadimg){
            elm.html('<img id="'+divId+'" class="'+attrs.typeimage+' img-rounded " src="/images/github.png">');
          }
          if(attrs.onlyview != 'true'){
            elm.off();
            elm.bind('click', function() {
              var uib = $uibModal.open({
                controller : 'PhotoController',
                controllerAs: 'vm',
                templateUrl : '/view/PhotoDir/photo.template.html',
                resolve :  {
                  divId : function(){
                    return divId;
                  }
                }
              });
              uib.result.then(function () {
              }, function (result) {
                imageFilename = result;
                attrs.uploadimg = null;
                ngModel.$setViewValue(result);
              });
            });
          }
        });
      }
    };


    return {
      require: ['ngModel'],
      restrict : 'EAC',
      link: link,
      scope: {}
    };

  }]);
