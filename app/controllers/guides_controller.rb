class GuidesController < ApplicationController
  def new # GET '/movements/:movement_id/guides/new'=> 'guides#new' (The form to create a new guide belonging to a movement is found in the movement show view AND in script#show-exercise-template in app/views/shared/_hs_templates.html.erb)
    @movement = Movement.find(params[:movement_id]) # finding the parent
    @guide = Guide.new # instance for nested resource form to wrap around
  end

  def create # POST '/movements/:movement_id/guides' => 'guides#create'
    movement = Movement.find(params[:movement_id]) # finding the parent movement instance
    guide = movement.guides.build(guide_params)
    authorize guide # Only a trainer can create a training guide
    render json: guide, status: 201 if guide.save # If the training guide is NOT valid, the AJAX POST request will not fire at all
  end

  def index # GET '/movements/:movement_id/guides' => 'guides#index'
    guides = Movement.find(params[:movement_id]).guides
    render json: guides, status: 200
  end

  def edit # GET '/movements/:movement_id/guides/:id/edit' => 'guides#edit'
    @movement = Movement.find(params[:movement_id])
    @guide = @movement.guides.find(params[:id])
    authorize @guide # Only the trainer who created the training guide can edit that guide in app/views/guides/edit.html.erb
  end
  # If the training guide is NOT valid (and therefore is NOT updated), the AJAX PATCH request will not fire at all
  def update # PATCH '/movements/:movement_id/guides/:id' => 'guides#update'
    guide = Movement.find(params[:movement_id]).guides.find(params[:id])
    render json: guide, status: 200 if guide.update(guide_params)
  end

  def destroy # DELETE '/movements/:movement_id/guides/:id' => 'guides#destroy'
    guide = Movement.find(params[:movement_id]).guides.find(params[:id])
    authorize guide # Only the trainer who created the training guide can delete that guide
    guide.destroy
    render json: guide, status: 200
  end

  private

    def guide_params
      params.require(:guide).permit(
        :proper_form,
        :breathing_technique,
        :modification,
        :challenge,
        :movement_id,
        :user_id
      )
    end
end