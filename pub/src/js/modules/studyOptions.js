var App = App || {};


App.studyOptions = function() {
    // console.log(studyOptions);

    var nodes = {
        $options: $('#options-select'),
        $posts: $('#post-results'),
        $resultsBtn: $('.show-posts'),
        $studyOptionsList: $('#study-options-list ul')
    };

    var ww = $(window).width();

    var blurOptions = function() {
        $('select').blur();
    };

    function AppViewModel() {
        var _self = this;
        var obj = studyOptions;
        var keys = Object.keys( studyOptions.taxonomy );
        _self.education = ko.observableArray(obj.taxonomy[keys[1]].childs);
        _self.locations = ko.observableArray(obj.taxonomy[keys[0]].childs);
        _self.subjects = ko.observableArray(obj.taxonomy[keys[2]].childs);
        _self.educationSelected = ko.observable();
        _self.locationSelected = ko.observable();
        _self.subjectSelected = ko.observable();
        _self.posts = ko.observableArray(obj.posts);
        _self.currentFilter = ko.observable();
        _self.locationsEnabled = ko.observable(false);
        _self.subjectsEnabled = ko.observable(false);
        _self.postsEnabled = ko.observable(false);
        _self.postsVisible = ko.observable(false);
        _self.filteredPostCategories = ko.observableArray();
        _self.duplicateFilteredPosts = ko.observableArray();
        _self.pathwayText = ko.observable();


        _self.fadeInPostResults = function() {
            $(nodes.$studyOptionsList.children()).fadeOut(200);
            _self.duplicateFilteredPosts(_self.totalFilteredPosts());
            var timeout = (nodes.$options.hasClass('after-filtered')) ? 400 : 1000;
            setTimeout(function() {
                nodes.$studyOptionsList.children().each(function(index) {
                    $(this).delay(300 * index).fadeIn(400);
                });
            }, timeout);
        }

        _self.educationChanged = function(obj, event) {
            _self.locationsEnabled(false);
            blurOptions();
            if (_self.filteredLocations().length > 0 && _self.educationSelected() != null) {
                _self.locationsEnabled(true);
            } else {
                _self.locationsEnabled(false);
            }
        };

        _self.locationChanged = function(obj, event) {
            blurOptions();
            if (_self.filteredLocations().length > 0 && _self.locationSelected() != null) {
                _self.subjectsEnabled(true);
            } else {
                _self.subjectsEnabled(false);
            }
        };

        _self.subjectChanged = function(obj, event) {
            blurOptions();
            if ((_self.filteredSubjects().length > 0 && _self.subjectSelected() != null && _self.locationSelected() != null) || nodes.$options.hasClass('filtered')) {
                _self.postsEnabled(true);
            } else {
                _self.postsEnabled(false);
            }
        };

        _self.showPosts = function() {
            var postCount,
                pathwaySingleText;
            _self.postsVisible(true);

            setTimeout(function() {
                nodes.$options.addClass('after-filtered');
            }, 600)
            if (ww > 768) {
                if (!nodes.$options.hasClass('filtered')) {
                    nodes.$options.removeClass().addClass('small-12 large-4 columns filtered');
                }

            } else {
                nodes.$options.removeClass().addClass('small-12 large-4 columns filtered');
            }
            nodes.$resultsBtn.html('Update results');

            // postCount = _self.totalFilteredPosts().length;
            // pathwaySingleText = (postCount > 1) ? 'pathways' : 'pathway';
            // _self.pathwayText('<b>Your results</b> showing ' + postCount + ' ' + pathwaySingleText + ' to a degree:');
            _self.fadeInPostResults();
            // console.log(_self.totalFilteredPosts());
        }

        _self.filteredPosts = ko.computed(function() {
            // empty filteredPostCategories
            _self.filteredPostCategories([]);
            if (!_self.educationSelected() && !_self.locationSelected() && !_self.subjectSelected()) {
                return _self.posts();
            } else {
                return ko.utils.arrayFilter(_self.posts(), function(post) {
                    for (var i = 0; i < post.info.categories.length; i++) {
                        if (post.info.categories[i] == _self.educationSelected()) {
                            ko.utils.arrayForEach(post.info.categories, function(item) {
                                _self.filteredPostCategories.push(item);
                            })
                            return post;
                        }
                    };
                });
            }
        });

        _self.totalFilteredPosts = ko.computed(function() {
            var prevIds = [];
            return ko.utils.arrayFilter(_self.filteredPosts(), function(post) {
                var postCats = post.info.categories;
                var curId = post.id;
                if (postCats.indexOf(_self.educationSelected()) != -1 &&
                    postCats.indexOf(_self.locationSelected()) != -1 &&
                    postCats.indexOf(_self.subjectSelected()) != -1) {
                    if (prevIds.indexOf(curId) === -1) {
                        prevIds.push(curId);
                        return post;
                    };
                }
            })
        });

        _self.filteredLocations = ko.computed(function() {
            return ko.utils.arrayFilter(_self.locations(), function(location) {
                for (var i = 0; i < _self.filteredPostCategories().length; i++) {
                    if (_self.filteredPostCategories()[i] === location.id) {
                        return location;
                    } else {
                        _self.locationsEnabled(false);
                    }
                }
            })
        })

        _self.filteredSubjects = ko.computed(function() {
            return ko.utils.arrayFilter(_self.subjects(), function(subject) {
                for (var i = 0; i < _self.filteredPosts().length; i++) {
                    if (_self.filteredPosts()[i].info.categories.indexOf(_self.locationSelected()) != -1 && _self.filteredPosts()[i].info.categories.indexOf(subject.id) != -1) {
                        // console.log(subject);
                        return subject;
                    }
                }
            });

        })
    }

    ko.applyBindings(new AppViewModel());

}
