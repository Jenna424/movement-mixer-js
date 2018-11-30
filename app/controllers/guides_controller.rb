class GuidesController < ApplicationController
  def new # GET '/movements/:movement_id/guides/new'=> 'guides#new'
    @movement = Movement.find(params[:movement_id]) # finding the parent
    @guide = Guide.new # instance for nested resource form to wrap around
  end

  def create # POST '/movements/:movement_id/guides' => 'guides#create'
    @movement = Movement.find(params[:movement_id]) # finding the parent movement instance
    @guide = @movement.guides.build(guide_params)
    authorize @guide
    if @guide.save
      render json: @guide
    else
      render "new" # present form to try creating a training guide belonging to the movement again
    end
  end

  def index # GET '/movements/:movement_id/guides' => 'guides#index'
    guides = Guide.all.where(movement: Movement.find(params[:movement_id]))
    render json: guides
  end

  def edit # GET '/movements/:movement_id/guides/:id/edit' => 'guides#edit'
    @movement = Movement.find(params[:movement_id])
    @guide = @movement.guides.find(params[:id])
    authorize @guide
  end

  def update # PATCH '/movements/:movement_id/guides/:id' => 'guides#update'
    @guide = Movement.find(params[:movement_id]).guides.find(params[:id])
    if @guide.update(guide_params)
      render json: @guide, status: 200
    else
      render json: { errors: @guide.errors.full_messages, status: :unprocessable_entity }
    end
  end

  def destroy # DELETE '/movements/:movement_id/guides/:id' => 'guides#destroy'
    guide = Movement.find(params[:movement_id]).guides.find(params[:id])
    authorize guide
    guide.destroy
    render json: guide
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