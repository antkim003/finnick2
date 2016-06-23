import { renderComponent, expect } from '../test_helper';
import Admin from '../../../src/components/admin/admin';


describe('admin', function () {
  let component;

  beforeEach(function () {
    component = renderComponent(Admin);
  });

  it('renders someting', function () {
    expect(component).to.exist;
    expect(component).to.contain('this is the admin view');
  });
});
