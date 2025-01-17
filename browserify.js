/*
 * Copyright (c) 2011 Romain Ruetschi <romain.ruetschi@gmail.com>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
    
module.exports = function($) {
  function supportsPlaceholder( element )
  {
      return element.placeholder === '' && element.placeholder !== undefined;
  }
  
  // Feature test for placeholder support as found in Modernizr
  // as well as in http://miketaylr.com/code/input-type-attr.html
  // via Mike Taylor's work
  var placeHolderSupport = {
    input    : supportsPlaceholder( document.createElement( 'input' ) ),
    textarea : supportsPlaceholder( document.createElement( 'textarea' ) )
  };
  
  $.fn.placeHoldize = ( function()
  {
    function _placeHoldize( force )
    {
        // Store a reference to the current jQuery element.
        var $this = $( this ),
            type  = this.nodeName.toLowerCase();
        
        if( !force && ( placeHolderSupport[ type ] || !$this.attr( 'placeholder' ) ) )
        {
            // There is no need for this plugin.
            return;
        }
            
        // Store the "placeholder"'s value.
        var placeHolder = $this.attr( 'placeholder' );
        
        // Only replace the "value" attribute's value if it's empty.
        // Thanks to kiddailey for the patch.
        if( $this.val().length <= 0 || $this.val() == placeHolder )
        {
            // To prevent flickering as classes are manipulated.
            // Thanks to kiddailey for the patch.
            $this.val( '' );
            
            // Remove the "placeholder" as it is no longer used
            // and add a "placeholdized" class to be able to reference
            // these elements later.
            $this.removeAttr( 'placeholder' ).addClass( 'placeholder-visible' );
                 
            // Copy the "placeholder" attribute's value to the "value" attribute.
            $this.val( placeHolder );
        }
        else
        {
            $this.removeClass( 'placeholder-visible' )
                 .addClass( 'placeholder-hidden' );
        }
        
        $this.addClass( 'placeholdized' );
        
        // On focus
        $this.focus( function()
        {
            // If the element's value is equal to the previously setted
            // placeholder's value:
            if( $this.val() === placeHolder )
            {
                // Empty the value.
                $this.val( '' );
                
                // Swap some classes to be able to style the element.
                $this.removeClass( 'placeholder-visible' )
                     .addClass( 'placeholder-hidden' );
            }
        } );
        
        // On focus
        $this.blur( function()
        {
            // If the element's value is empty:
            if( $this.val() === '' )
            {
                // Restore the placeholder's value.
                $this.val( placeHolder );
                
                // Swap some classes to be able to style the element.
                $this.removeClass( 'placeholder-hidden' )
                     .addClass( 'placeholder-visible' );
            }
            else
            {
                // Swap some classes to be able to style the element.
                $this.removeClass( 'placeholder-visible' )
                     .addClass( 'placeholder-hidden' );
            }
        } );
    }
    
    function _emptyFormOnSubmit( $elements )
    {
        var $forms = $elements.closest( 'form' );
            
        $forms.submit( function()
        {
            var $this = $( this );
            
            // This check avoid processing more than once the same form.
            if( $this.data( 'placeHoldize.submitHandlerCalled' ) )
            {
                return;
            }
            
            $this.find( '.placeholder-visible' )
                 .val( '' )
                 .data( 'placeHoldize.submitHandlerCalled', true );
        } );
        
        return true;
    }
    
    return function( force )
    {
        // Apply the _placeHoldize function on every element.
        this.each( function()
        {
            _placeHoldize.call( this, force );
        } );
        
        // Empty the "value" attribute before the form is submitted to fully mimics the
        // HTML5 "placeholder" attribute behavior.
        _emptyFormOnSubmit( this );
        
        return this;
    };
  } )();
};
