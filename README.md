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

# License

This project has been licensed under the MIT open source license.
[Read the LICENSE.md file in this repository.](LICENSE)

MIT License

Copyright (c) 2018 Jenna424

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.