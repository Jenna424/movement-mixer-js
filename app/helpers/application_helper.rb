module ApplicationHelper
  def entitle_page(text)
    content_for :title do
      text += " | " if text.present?
      text += "Movement Mixer"
    end
  end

  def validation_errors_for(object = nil) # object is AR instance or nil by default
    if object && object.errors.any?
      render partial: "shared/error_explanation_div", locals: { object: object }
    end
  end

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

  def routines_index_link_text
    current_user.trainer? ? "View Workouts by Clients" : "View All Workout Routines"
  end
end
