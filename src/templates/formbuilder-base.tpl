<div class="container form-container">

  <div class="left-col" id="toolbox-col" style="padding-top: 37px">

    <ul class="nav-tabs" role="tablist">
      <li class="active toolbox-tab" data-target="#add-field">{localize_i18n.tabs.addfield}</li>
      <li class="toolbox-tab" data-target="#field-settings">{localize_i18n.tabs.settings}</li>
      <li class="toolbox-tab" data-target="#form-settings">{localize_i18n.tabs.form}</li>
    </ul>

    <div class="tab-content">

      <div class="tab-pane active" style="padding: 20px;" id="add-field">

        <div class="col-sm-6">
          <button class="button new-element" data-type="element-single-line-text" style="width: 100%;">{localize_i18n.fields.text}</button>
          <button class="button new-element" data-type="element-paragraph-text" style="width: 100%;">{localize_i18n.fields.paragraph}</button>
          <button class="button new-element" data-type="element-checkboxes" style="width: 100%;">{localize_i18n.fields.chebox}</button>
        </div>

        <div class="col-sm-6">
          <button class="button new-element" data-type="element-number" style="width: 100%;">{localize_i18n.fields.number}</button>
          <button class="button new-element" data-type="element-multiple-choice" style="width: 100%;">{localize_i18n.fields.dropdown}</button>
        </div>

      </div>

      <div class="tab-pane" id="field-settings" style="padding: 20px; display: none">

        <div class="section">
          <div class="form-group">
            <label>{localize_i18n.field_options.label}</label>
            <input type="text" class="form-control" id="field-label" value="{localize_i18n.untitled}" />
          </div>
        </div>

         <div class="section" id="field-choices" style="display: none;">
       
          <div class="form-group">
              <label>{localize_i18n.field_options.choices}</label>
          </div>

        </div>

        <div class="section">
        <div class="form-group">
            <label>{localize_i18n.field_options.options}</label>
        </div>

        <div class="field-options">
            <div class="checkbox">
              <label>
                <input type="checkbox" id="required">{localize_i18n.field_options.required}
              </label>
            </div>
          </div>
        </div>

        <button class="button danger" id="control-remove-field">{localize_i18n.buttons.remove}</button>&nbsp;
        <button class="button" id="control-add-field">{localize_i18n.buttons.add}</button>

      </div>

      <div class="tab-pane" id="form-settings" style="padding: 20px; display: none">

        <div class="section">
          <div class="form-group">
            <label>{localize_i18n.field_options.title}</label>
            <input type="text" class="bind-control form-control" data-bind="#form-title-label" id="form-title" value="" />
          </div>

          <div class="form-group">
            <label>{localize_i18n.field_options.description}</label>
            <textarea class="bind-control form-control" data-bind="#form-description-label" id="form-description"></textarea>
          </div>
        </div>

      </div>

    </div>

  </div>

  <div class="right-col" id="form-col">

    <div class="loading">
      {localize_i18n.loading}...
    </div>

  </div>

  <div style="clear: both"></div>

</div> <!-- /container -->