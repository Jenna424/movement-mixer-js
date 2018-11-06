require 'test_helper'

class RoutinesControllerTest < ActionDispatch::IntegrationTest
  test "should get new" do
    get routines_new_url
    assert_response :success
  end

  test "should get edit" do
    get routines_edit_url
    assert_response :success
  end

end
