'use strict';

angular
    .module('trello')
    .controller('CardWindowController', CardWindowController);

CardWindowController.$inject = ['$scope', '$uibModalInstance', 'entity', 'Comment', 'Upload'];

function CardWindowController ($scope, $uibModalInstance, entity, Comment, Upload) {
    const VIEWS = {
        COMMENTS: 'COMMENTS',
        ATTACHMENTS: 'ATTACHMENTS'
    };

    // Window
    $scope.close = close;
    $scope.changeView = changeView;

    // Comments
    $scope.addComment = addComment;

    // Attachments
    $scope.submit = submit;

    $scope.VIEWS = VIEWS;
    $scope.card = entity;
    $scope.commentContent = '';

    $scope.onFileSelect = function () {
        console.log('hi');
    };

    changeView(VIEWS.ATTACHMENTS);

    initializeFileButtonBehaviour();

    function close() {
        $uibModalInstance.dismiss('cancel');
    }

    function changeView(view) {
        console.log('View changed from ' + $scope.view + ' to ' + view);
        $scope.view = view;
    }

    function addComment(comment) {
        console.log('Add comment request for card with id: ' + $scope.card.id + ' and content: ' + comment);

        if (comment != null && comment.length > 0) {
            Comment.save({cardId: $scope.card.id, content: comment}, onSuccess, onError);
        }

        function onSuccess(response) {
            console.log('Added new comment to card with id ' + $scope.card.id);
            $scope.card.comments.push(response);
        }

        function onError() {
            console.log('Error while adding comment')
        }
    }

    function submit() {
        if ($scope.file) {
            upload($scope.file);
        }
    }

    function upload(file) {
        console.log('upload avatar');
        Upload.upload({
            url: '/cards/' + $scope.card.id + '/upload_attachment',
            data: {cardId: $scope.card.id, file: file}
        }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            $scope.card.attachments.push(resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    }

    function initializeFileButtonBehaviour() {
        $(function() {
            $(document).on('change', ':file', function() {
                var input = $(this),
                    numFiles = input.get(0).files ? input.get(0).files.length : 1,
                    label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
                input.trigger('fileselect', [numFiles, label]);
            });

            $(document).ready( function() {
                $(':file').on('fileselect', function(event, numFiles, label) {

                    var input = $(this).parents('.input-group').find(':text'),
                        log = numFiles > 1 ? numFiles + ' files selected' : label;

                    if(input.length) {
                        input.val(log);
                    } else {
                        if( log ) alert(log);
                    }

                });
            });
        });
    }
}