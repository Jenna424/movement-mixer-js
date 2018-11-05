module ApplicationHelper
  def set_class_for(flash_type)
    case flash_type
    when "error"
      "alert-danger"    # Red
    when "alert"
      "alert-warning"   # Yellow
    when "notice"
      "alert-info"      # Blue
    when "success"
      "alert-success"   # Green
    end
  end
end