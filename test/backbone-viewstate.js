(function() {
  var viewState;
  var allStartValue = {
    some: 'value',
    someOther: 'otherValue'
  };

  module("Backbone.ViewState", {

    setup: function() {
      viewState = new Backbone.ViewState(allStartValue);
    }

  });

  test("get all attributes", 1, function() {
    deepEqual(viewState.getAttributes(), allStartValue, "should equal all attributes");
  });

  test("get and set attributes", 3, function() {
    equal(viewState.get('some'), allStartValue.some, "should equal some value");

    viewState.set('some', 'secondValue');
    equal(viewState.get('some'), 'secondValue', "should equal also after change via set (as parameters)");

    viewState.set({ someOther: 'secondOtherValue' });
    equal(viewState.get('someOther'), 'secondOtherValue', "should equal after change via set (as object)");
  });

  test("silent and non silent changes", 4, function() {
    var changeCount = 0;
    viewState.on('change', function() {
      changeCount++;
    });

    viewState.set('some', 'non-silent-change');
    equal(changeCount, 1, "should by default emit change event");

    viewState.set({ someOther: 'non-silent-change'});
    equal(changeCount, 2, "should by default emit change event (as object)");

    viewState.set('some', 'silent-change', { silent: true });
    equal(changeCount, 2, "should not emit change if silent:true is passed (as parameters)");

    viewState.set({ some: 'silent-change-obj' }, { silent: true });
    equal(changeCount, 2, "should not emit change if silent:true is passed (as object)");
  });
})();