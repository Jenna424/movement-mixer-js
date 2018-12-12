module GuidesHelper
  def guide_button_text
    action_name == "show" ? "Publish Training Guide" : "Revise Guide"
  end
end