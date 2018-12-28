# README
Movement Mixer is a Ruby on Rails application that utilizes JavaScript and a JSON API to allow clients and personal trainers to design workout routines together. During the registration process, prospective users request a role in the Movement Mixer community, which will be formally assigned by the admin, who manages accounts. Clients are authorized to create workout routines and the exercise movements that comprise these routines, and to specify the fitness equipment requirements of their workouts. Personal trainers, who are assigned a client base by the admin, are authorized to edit workout routines designed by their clients and to create training guides that demonstrate the proper performance of exercise movements. Additionally, personal trainers can create fitness training types and workout target areas, which clients use to categorize their workout plans.

# Installation Guide
1. Fork and clone this repository.
2. Install all gem dependencies by running bundle install (or bundle).
3. Run migrations with the command rake db:migrate to set up the database.
4. Seed your database by running rake db:seed.
5. Run the command rails s to start up your application's local server.
6. Navigate to http://localhost:3000/ to start using Movement Mixer!

# Contributors' Guide
1. Please fork and clone this repository.
2. Run bundle install (or bundle) to install/update gems.
3. Make any changes you see fit, such as the addition of a new feature or a bug fix.
4. Concisely and clearly document any changes you make with a descriptive commit message!
5. Send a pull request.
Bug reports and pull requests are welcome on GitHub at https://github.com/Jenna424/movement-mixer-js. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the Contributor Covenant code of conduct.