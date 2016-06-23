import { renderComponent, expect } from '../test_helper';
import UserList from '../../../src/components/admin/user_list';


describe('UserList', function () {
  let component;

  beforeEach(function () {
    component = renderComponent(UserList);
  });

  it('renders someting', function () {
    expect(component).to.exist;
  });
});
