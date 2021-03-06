(function() {
    'use strict';

    angular
        .module('trello')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('board', {
            parent: 'app',
            url: '/board/{id}?share={shareId}',
            data: {
                pageTitle: 'Board'
            },
            views: {
                'content@': {
                    templateUrl: '/app/board/board.html',
                    controller: 'BoardController'
                }
            },
            params: {
                refresh: { dynamic: true}
            }
        })
        .state('board.card', {
            parent: 'board',
            url: '/cards/{cardId}',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/board/card-window.html',
                    controller: 'CardWindowController',
                    size: 'lg',
                    backdrop: 'static',
                    resolve: {
                        entity: ['Card', function(Card) {
                            return Card.get({id : $stateParams.cardId}).$promise;
                        }]
                    }
                }).result.then(function(result) {
                    $state.go('^', {refresh: result});
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }
})();