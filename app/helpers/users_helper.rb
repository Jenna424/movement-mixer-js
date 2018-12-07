module UsersHelper
  def display_fitness_match(user)
    if user.client?
      if user.trainer.nil?
        "#{user.name} does not have a personal fitness trainer."
      else
        "#{user.name} trains with Personal Trainer #{user.trainer.name}."
      end
    elsif user.trainer?
      if !user.clients.empty?
        "#{user.name} currently trains #{user.clients.count} fitness #{'client'.pluralize(user.clients.count)}."
      else
        "#{user.name} is not assigned to any fitness clients."
      end
    elsif user.admin?
      "#{user.name} manages all fitness clients and personal trainers."
    else
      "#{user.name} must be assigned a role in order to connect with the Movement Mixer community."
    end
  end

  def submit_button_text
    action_name == "new" ? "Submit Registration Form" : "Update Your Account"
  end
end
